#!/bin/bash
source /opt/staynest/app.env
DB_HOST=$(echo $DB_URL | sed 's|jdbc:postgresql://||' | cut -d: -f1)
DB_NAME=$(echo $DB_URL | sed 's|.*:5432/||' | cut -d? -f1)

# Generate hash for Pass12345
HASH=$(python3 -c "import bcrypt; print(bcrypt.hashpw(b'Pass12345', bcrypt.gensalt(10)).decode())")
echo "Hash: $HASH"

# Update all users
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USERNAME" -d "$DB_NAME" -c "UPDATE users SET password = '$HASH';"
echo "Updated all users"

# Test login directly
sleep 2
RESULT=$(curl -s -X POST http://localhost:8080/login/user \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"202301040048@mitaoe.ac.in\",\"password\":\"Pass12345\"}" \
  -w "\nHTTP_STATUS:%{http_code}")
echo "Login test result: $RESULT"
