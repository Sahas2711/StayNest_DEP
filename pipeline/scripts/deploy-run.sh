#!/bin/bash
set -e

PHASE=$1

pre_phase() {
  echo "=== Resolving EC2 instance IDs from ASG $ASG_NAME ==="
  INSTANCE_IDS=$(aws autoscaling describe-auto-scaling-groups \
    --auto-scaling-group-names "$ASG_NAME" \
    --query "AutoScalingGroups[0].Instances[?LifecycleState=='InService'].InstanceId" \
    --output text)
  if [ -z "$INSTANCE_IDS" ]; then
    echo "ERROR: No InService instances in ASG $ASG_NAME"
    exit 1
  fi
  echo "Target instances: $INSTANCE_IDS"
  echo "$INSTANCE_IDS" > /tmp/instance_ids.txt
}

build_phase() {
  INSTANCE_IDS=$(cat /tmp/instance_ids.txt)

  echo "=== Uploading JAR to S3 ==="
  aws s3 cp "$CODEBUILD_SRC_DIR_BackendArtifact/target/StayNest-0.0.1-SNAPSHOT.jar" \
    "s3://${ARTIFACT_BUCKET}/releases/StayNest-0.0.1-SNAPSHOT.jar"

  echo "=== Creating deploy script ==="
  cat > /tmp/deploy.sh << SCRIPT
#!/bin/bash
set -e
systemctl stop staynest || true
aws s3 cp s3://${ARTIFACT_BUCKET}/releases/StayNest-0.0.1-SNAPSHOT.jar /opt/staynest/StayNest-0.0.1-SNAPSHOT.jar
chown ec2-user:ec2-user /opt/staynest/StayNest-0.0.1-SNAPSHOT.jar
chmod 500 /opt/staynest/StayNest-0.0.1-SNAPSHOT.jar
REGION=ap-south-1
SECRET_JSON=\$(aws secretsmanager get-secret-value --region \$REGION --secret-id staynest/prod --query SecretString --output text)
cat > /opt/staynest/app.env << ENVEOF
DB_URL="\$(echo \$SECRET_JSON | jq -r .DB_URL)"
DB_USERNAME="\$(echo \$SECRET_JSON | jq -r .DB_USERNAME)"
DB_PASSWORD="\$(echo \$SECRET_JSON | jq -r .DB_PASSWORD)"
JWT_SECRET="\$(echo \$SECRET_JSON | jq -r .JWT_SECRET)"
MAIL_USERNAME="\$(echo \$SECRET_JSON | jq -r .MAIL_USERNAME)"
MAIL_PASSWORD="\$(echo \$SECRET_JSON | jq -r .MAIL_PASSWORD)"
RESEND_API_KEY="\$(echo \$SECRET_JSON | jq -r .RESEND_API_KEY)"
CORS_ALLOWED_ORIGINS="\$(echo \$SECRET_JSON | jq -r .CORS_ALLOWED_ORIGINS)"
FRONTEND_BASE_URL="\$(echo \$SECRET_JSON | jq -r .CORS_ALLOWED_ORIGINS)"
SES_FROM_EMAIL="${SES_FROM_EMAIL}"
S3_BUCKET_NAME="staynest-uploads-${AWS_ACCOUNT_ID}-ap-south-1"
PORT=8080
ENVEOF
chmod 600 /opt/staynest/app.env
systemctl enable staynest
systemctl start staynest
echo "Waiting 60s for app to start..."
sleep 60
for i in 1 2 3 4 5 6 7 8 9 10; do
  HTTP=\$(curl -s -o /dev/null -w '%{http_code}' http://localhost:8080/health || echo 000)
  echo "Health check \$i: \$HTTP"
  if [ "\$HTTP" = "200" ]; then echo "Deploy successful"; exit 0; fi
  echo "--- App logs ---"
  journalctl -u staynest --no-pager -n 20
  sleep 20
done
echo "=== FINAL APP LOGS ==="
journalctl -u staynest --no-pager -n 100
exit 1
SCRIPT

  echo "=== Uploading deploy script to S3 ==="
  aws s3 cp /tmp/deploy.sh "s3://${ARTIFACT_BUCKET}/releases/deploy.sh"

  echo "=== Sending SSM deploy command ==="
  INSTANCE_LIST=$(echo "$INSTANCE_IDS" | tr ' ' ',')
  COMMAND_ID=$(aws ssm send-command \
    --document-name "AWS-RunShellScript" \
    --targets "Key=instanceids,Values=$INSTANCE_LIST" \
    --parameters "commands=[\"aws s3 cp s3://${ARTIFACT_BUCKET}/releases/deploy.sh /tmp/deploy.sh && bash /tmp/deploy.sh\"]" \
    --comment "StayNest deploy" \
    --timeout-seconds 300 \
    --query "Command.CommandId" \
    --output text)
  echo "SSM Command ID: $COMMAND_ID"
  echo "$COMMAND_ID" > /tmp/command_id.txt
}

post_phase() {
  [ -f /tmp/command_id.txt ] || { echo "No command ID found, skipping poll."; exit 0; }
  INSTANCE_IDS=$(cat /tmp/instance_ids.txt)
  COMMAND_ID=$(cat /tmp/command_id.txt)

  echo "=== Polling SSM command status ==="
  for INSTANCE_ID in $INSTANCE_IDS; do
    echo "Checking $INSTANCE_ID"
    for i in $(seq 1 30); do
      STATUS=$(aws ssm get-command-invocation \
        --command-id "$COMMAND_ID" \
        --instance-id "$INSTANCE_ID" \
        --query "Status" \
        --output text 2>/dev/null || echo "Pending")
      echo "  [$i/30] $STATUS"
      if [ "$STATUS" = "Success" ]; then
        echo "OK: $INSTANCE_ID"
        break
      elif [ "$STATUS" = "Failed" ] || [ "$STATUS" = "TimedOut" ] || [ "$STATUS" = "Cancelled" ]; then
        aws ssm get-command-invocation \
          --command-id "$COMMAND_ID" \
          --instance-id "$INSTANCE_ID" \
          --query "StandardErrorContent" \
          --output text
        exit 1
      fi
      sleep 10
    done
  done
  echo "=== Deploy complete ==="
}

case "$PHASE" in
  pre)   pre_phase ;;
  build) build_phase ;;
  post)  post_phase ;;
  *)     echo "Unknown phase: $PHASE"; exit 1 ;;
esac
