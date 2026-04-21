#!/bin/bash
# ============================================================
# StayNest - One-shot CloudFormation deployment script
# Prerequisites: AWS CLI configured with admin permissions, jq
# Region: us-east-1
# ============================================================
set -e

STACK_NAME="staynest-infra"
REGION="us-east-1"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text --region "$REGION")
TEMPLATE_FILE="infrastructure/cloudformation.yml"
PARAMS_FILE="infrastructure/parameters.json"

echo "=== StayNest Infrastructure Deployment ==="
echo "Account : $ACCOUNT_ID"
echo "Region  : $REGION"
echo ""

# ── Pre-flight checks ──────────────────────────────────────
echo "Step 1: Pre-flight checks..."

if ! aws ec2 describe-key-pairs --region "$REGION" > /dev/null 2>&1; then
  echo "ERROR: AWS CLI not configured or no permissions. Run 'aws configure' first."
  exit 1
fi

echo "  ✓ AWS CLI configured"
echo ""

# ── Verify parameters are filled ──────────────────────────
echo "Step 2: Verifying parameters.json..."
if grep -q "REPLACE_WITH" "$PARAMS_FILE"; then
  echo "ERROR: Found unreplaced placeholders in $PARAMS_FILE"
  echo "Please fill in all REPLACE_WITH_* values before deploying."
  grep "REPLACE_WITH" "$PARAMS_FILE"
  exit 1
fi
echo "  ✓ Parameters look good"
echo ""

# ── Verify SES email identity ──────────────────────────────
echo "Step 3: Checking SES email verification..."
SES_EMAIL=$(jq -r '.[] | select(.ParameterKey=="SESFromEmail") | .ParameterValue' "$PARAMS_FILE")
SES_STATUS=$(aws ses get-identity-verification-attributes \
  --identities "$SES_EMAIL" \
  --region "$REGION" \
  --query "VerificationAttributes.\"$SES_EMAIL\".VerificationStatus" \
  --output text 2>/dev/null || echo "NotFound")

if [ "$SES_STATUS" != "Success" ]; then
  echo "WARNING: SES email '$SES_EMAIL' is not verified (status: $SES_STATUS)."
  echo "Lambda email notifications will fail until this email is verified in SES."
  echo "Run: aws ses verify-email-identity --email-address $SES_EMAIL --region $REGION"
  echo ""
  read -rp "Continue anyway? (y/N): " CONFIRM
  [ "$CONFIRM" = "y" ] || exit 1
else
  echo "  ✓ SES email verified"
fi
echo ""

# ── Deploy CloudFormation stack ────────────────────────────
echo "Step 4: Deploying CloudFormation stack '$STACK_NAME'..."
echo "  This will take 10-15 minutes (RDS provisioning is the slowest step)."
echo ""

aws cloudformation deploy \
  --template-file "$TEMPLATE_FILE" \
  --stack-name "$STACK_NAME" \
  --parameter-overrides file://"$PARAMS_FILE" \
  --capabilities CAPABILITY_NAMED_IAM \
  --region "$REGION" \
  --no-fail-on-empty-changeset

echo ""
echo "=== Stack deployed successfully ==="
echo ""

# ── Print outputs ──────────────────────────────────────────
echo "=== Stack Outputs ==="
aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --query "Stacks[0].Outputs[*].[OutputKey,OutputValue]" \
  --output table

# ── Post-deploy: update Secrets Manager with real values ──
echo ""
echo "=== IMPORTANT POST-DEPLOY STEPS ==="
SECRET_ARN=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='DBSecretArn'].OutputValue" \
  --output text)

CF_URL=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='CloudFrontURL'].OutputValue" \
  --output text)

echo ""
echo "1. Update the Secrets Manager secret with real values:"
echo "   Secret ARN: $SECRET_ARN"
echo "   Run: aws secretsmanager update-secret --secret-id \"$SECRET_ARN\" --secret-string file://infrastructure/secrets-template.json --region $REGION"
echo ""
echo "2. Set CORS_ALLOWED_ORIGINS in the secret to your CloudFront URL:"
echo "   CloudFront URL: $CF_URL"
echo ""
echo "3. Create a GitHub CodeStar Connection if not done:"
echo "   https://console.aws.amazon.com/codesuite/settings/connections"
echo ""
echo "4. Push to GitHub main branch to trigger the pipeline:"
echo "   https://console.aws.amazon.com/codesuite/codepipeline/pipelines"
