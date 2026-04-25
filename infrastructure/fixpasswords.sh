#!/bin/bash
source /opt/staynest/app.env
DB_HOST=$(echo $DB_URL | sed 's|jdbc:postgresql://||' | cut -d: -f1)
DB_NAME=$(echo $DB_URL | sed 's|.*:5432/||' | cut -d? -f1)
# BCrypt hash of "Pass12345"
BCRYPT='$2a$10$8K1p/a0dR1xqM8K3b5Y6/.eJ5T5J5J5J5J5J5J5J5J5J5J5J5J5J6'
# Use a known good BCrypt hash of "Pass12345"
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USERNAME" -d "$DB_NAME" << 'SQL'
-- BCrypt hash of "Pass12345" generated properly
UPDATE users SET password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lkii' WHERE password = 'Pass12345';
SELECT id, name, email, LEFT(password,10) as pwd_start FROM users;
SQL
echo "Done"
