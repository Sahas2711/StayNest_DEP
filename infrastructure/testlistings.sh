#!/bin/bash
source /opt/staynest/app.env
DB_HOST=$(echo $DB_URL | sed 's|jdbc:postgresql://||' | cut -d: -f1)
DB_NAME=$(echo $DB_URL | sed 's|.*:5432/||' | cut -d? -f1)

echo "=== Listings count ==="
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USERNAME" -d "$DB_NAME" -c "SELECT COUNT(*) FROM pg_listings;"

echo "=== Test API ==="
curl -s http://localhost:8080/listing/all -w "\nHTTP:%{http_code}" 2>&1 | tail -5

echo "=== App error logs ==="
journalctl -u staynest --no-pager --since "2 minutes ago" 2>&1 | grep -i "error\|exception\|500" | tail -20
