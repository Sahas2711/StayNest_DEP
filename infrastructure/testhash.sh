#!/bin/bash
source /opt/staynest/app.env
DB_HOST=$(echo $DB_URL | sed 's|jdbc:postgresql://||' | cut -d: -f1)
DB_NAME=$(echo $DB_URL | sed 's|.*:5432/||' | cut -d? -f1)

# Generate BCrypt hash using Java (already installed)
cat > /tmp/HashGen.java << 'EOF'
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
public class HashGen {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        System.out.println(encoder.encode("Pass12345"));
    }
}
EOF

# Use Python to generate BCrypt instead
python3 -c "
import subprocess
result = subprocess.run(['java', '-cp', '/opt/staynest/StayNest-0.0.1-SNAPSHOT.jar', 'org.springframework.boot.loader.launch.JarLauncher'], capture_output=True)
" 2>/dev/null || true

# Use bcrypt via python3
python3 -c "
import crypt
import hashlib
# Simple test - just update with a known working hash
# \$2a\$10\$slYQmyNdgzCuyF8136Ld5uSmBFnos3bMQFGMTnOFBMBMBMBMBMBMBM is BCrypt of 'password'
print('Using python bcrypt')
" 2>/dev/null

# Install bcrypt and generate
pip3 install bcrypt -q 2>/dev/null
HASH=$(python3 -c "import bcrypt; print(bcrypt.hashpw(b'Pass12345', bcrypt.gensalt()).decode())")
echo "Hash for Pass12345: $HASH"

PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USERNAME" -d "$DB_NAME" -c "UPDATE users SET password = '$HASH' WHERE id = 1; SELECT email, LEFT(password,20) FROM users WHERE id=1;"
