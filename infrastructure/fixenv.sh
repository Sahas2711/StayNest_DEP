#!/bin/bash
REGION=ap-south-1
SECRET_JSON=$(aws secretsmanager get-secret-value --region $REGION --secret-id staynest/prod --query SecretString --output text)

DB_URL=$(echo $SECRET_JSON | jq -r .DB_URL)
DB_USERNAME=$(echo $SECRET_JSON | jq -r .DB_USERNAME)
DB_PASSWORD=$(echo $SECRET_JSON | jq -r .DB_PASSWORD)
JWT_SECRET=$(echo $SECRET_JSON | jq -r .JWT_SECRET)
MAIL_USERNAME=$(echo $SECRET_JSON | jq -r .MAIL_USERNAME)
MAIL_PASSWORD=$(echo $SECRET_JSON | jq -r .MAIL_PASSWORD)
RESEND_API_KEY=$(echo $SECRET_JSON | jq -r .RESEND_API_KEY)
CORS_ALLOWED_ORIGINS=$(echo $SECRET_JSON | jq -r .CORS_ALLOWED_ORIGINS)

# Write env file with quoted values (systemd EnvironmentFile supports this)
cat > /opt/staynest/app.env << ENVEOF
DB_URL="${DB_URL}"
DB_USERNAME="${DB_USERNAME}"
DB_PASSWORD="${DB_PASSWORD}"
JWT_SECRET="${JWT_SECRET}"
MAIL_USERNAME="${MAIL_USERNAME}"
MAIL_PASSWORD="${MAIL_PASSWORD}"
RESEND_API_KEY="${RESEND_API_KEY}"
CORS_ALLOWED_ORIGINS="${CORS_ALLOWED_ORIGINS}"
PORT=8080
ENVEOF

chmod 600 /opt/staynest/app.env
echo "=== app.env written ==="
cat /opt/staynest/app.env

systemctl daemon-reload
systemctl restart staynest
echo "Waiting 55s..."
sleep 55
HTTP=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/health)
echo "Health: $HTTP"
if [ "$HTTP" != "200" ]; then
  journalctl -u staynest --no-pager -n 20
fi
