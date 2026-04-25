#!/bin/bash
aws s3 cp s3://staynest-artifacts-149831798853-ap-south-1/releases/seed.sql /tmp/seed.sql --region ap-south-1
source /opt/staynest/app.env
DB_HOST=$(echo $DB_URL | sed 's|jdbc:postgresql://||' | cut -d: -f1)
DB_NAME=$(echo $DB_URL | sed 's|.*:5432/||' | cut -d? -f1)
echo "Connecting to $DB_HOST / $DB_NAME"
# Install psql if not present
if ! command -v psql &>/dev/null; then
  amazon-linux-extras enable postgresql14 2>/dev/null || true
  yum install -y postgresql 2>&1 | tail -3
fi
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USERNAME" -d "$DB_NAME" -f /tmp/seed.sql 2>&1
echo "Seed done"
