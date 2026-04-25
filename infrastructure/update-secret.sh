#!/bin/bash
# Run this script ONCE after stack creation to populate real secret values.
# The 502 error will persist until this is done and the pipeline runs.
set -e

REGION="ap-south-1"
STACK_NAME="stack-9"

SECRET_ARN=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='DBSecretArn'].OutputValue" \
  --output text)

RDS_ENDPOINT=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='RDSEndpoint'].OutputValue" \
  --output text)

CF_URL=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='CloudFrontURL'].OutputValue" \
  --output text)

echo "Secret ARN  : $SECRET_ARN"
echo "RDS Endpoint: $RDS_ENDPOINT"
echo "Frontend URL: $CF_URL"
echo ""

# ── FILL IN THESE VALUES ──────────────────────────────────
JWT_SECRET="REPLACE_WITH_STRONG_SECRET_MIN_32_CHARS"
MAIL_USERNAME="REPLACE_WITH_GMAIL"
MAIL_PASSWORD="REPLACE_WITH_GMAIL_APP_PASSWORD"
RESEND_API_KEY="REPLACE_WITH_RESEND_KEY"
# ─────────────────────────────────────────────────────────

if echo "$JWT_SECRET" | grep -q "REPLACE"; then
  echo "ERROR: Fill in the values above before running this script."
  exit 1
fi

aws secretsmanager update-secret \
  --secret-id "$SECRET_ARN" \
  --region "$REGION" \
  --secret-string "{
    \"DB_URL\": \"jdbc:postgresql://${RDS_ENDPOINT}:5432/staynest?sslmode=require\",
    \"DB_USERNAME\": \"staynest_admin\",
    \"DB_PASSWORD\": \"$(aws secretsmanager get-secret-value --secret-id $SECRET_ARN --region $REGION --query SecretString --output text | python3 -c 'import sys,json; print(json.load(sys.stdin)[\"DB_PASSWORD\"])')\",
    \"JWT_SECRET\": \"${JWT_SECRET}\",
    \"MAIL_USERNAME\": \"${MAIL_USERNAME}\",
    \"MAIL_PASSWORD\": \"${MAIL_PASSWORD}\",
    \"RESEND_API_KEY\": \"${RESEND_API_KEY}\",
    \"CORS_ALLOWED_ORIGINS\": \"${CF_URL}\"
  }"

echo ""
echo "Secret updated. Now trigger the pipeline to deploy the backend:"
PIPELINE=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='PipelineName'].OutputValue" \
  --output text)

aws codepipeline start-pipeline-execution \
  --name "$PIPELINE" \
  --region "$REGION"

echo "Pipeline '$PIPELINE' triggered."
echo "Monitor at: https://${REGION}.console.aws.amazon.com/codesuite/codepipeline/pipelines/${PIPELINE}/view"
