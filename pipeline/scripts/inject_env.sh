#!/bin/bash
set -e

echo "=== Injecting environment variables from Secrets Manager ==="

# Requires: jq, aws cli (both pre-installed on Amazon Linux 2)
yum install -y jq 2>/dev/null || true

# Read the secret ARN from instance tags
REGION=$(curl -s http://169.254.169.254/latest/meta-data/placement/region)
INSTANCE_ID=$(curl -s http://169.254.169.254/latest/meta-data/instance-id)

SECRET_ARN=$(aws ec2 describe-tags \
  --region "$REGION" \
  --filters "Name=resource-id,Values=$INSTANCE_ID" "Name=key,Values=SecretArn" \
  --query "Tags[0].Value" \
  --output text)

if [ -z "$SECRET_ARN" ] || [ "$SECRET_ARN" = "None" ]; then
  echo "ERROR: SecretArn tag not found on instance. Cannot inject secrets."
  exit 1
fi

echo "Fetching secret: $SECRET_ARN"
SECRET_JSON=$(aws secretsmanager get-secret-value \
  --region "$REGION" \
  --secret-id "$SECRET_ARN" \
  --query SecretString \
  --output text)

# Write env file (readable only by ec2-user)
cat > /opt/staynest/app.env << EOF
DB_URL=$(echo "$SECRET_JSON" | jq -r '.DB_URL')
DB_USERNAME=$(echo "$SECRET_JSON" | jq -r '.DB_USERNAME')
DB_PASSWORD=$(echo "$SECRET_JSON" | jq -r '.DB_PASSWORD')
JWT_SECRET=$(echo "$SECRET_JSON" | jq -r '.JWT_SECRET')
MAIL_USERNAME=$(echo "$SECRET_JSON" | jq -r '.MAIL_USERNAME')
MAIL_PASSWORD=$(echo "$SECRET_JSON" | jq -r '.MAIL_PASSWORD')
RESEND_API_KEY=$(echo "$SECRET_JSON" | jq -r '.RESEND_API_KEY')
CORS_ALLOWED_ORIGINS=$(echo "$SECRET_JSON" | jq -r '.CORS_ALLOWED_ORIGINS')
PORT=8080
EOF

chmod 600 /opt/staynest/app.env
chown ec2-user:ec2-user /opt/staynest/app.env

echo "=== Environment variables injected successfully ==="
