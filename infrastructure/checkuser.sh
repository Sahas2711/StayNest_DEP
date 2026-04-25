#!/bin/bash
source /opt/staynest/app.env
DB_HOST=$(echo $DB_URL | sed 's|jdbc:postgresql://||' | cut -d: -f1)
DB_NAME=$(echo $DB_URL | sed 's|.*:5432/||' | cut -d? -f1)
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USERNAME" -d "$DB_NAME" -c "SELECT id, name, email, role, LEFT(password,30) as pwd_prefix FROM users;" 2>&1
