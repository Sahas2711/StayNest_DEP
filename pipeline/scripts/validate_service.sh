#!/bin/bash
set -e

echo "=== Validating StayNest service ==="

# Wait for Spring Boot to fully start (it takes a few seconds after systemd reports active)
sleep 15

# Hit the health endpoint
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/health || echo "000")

if [ "$HTTP_CODE" = "200" ]; then
    echo "=== Health check passed (HTTP $HTTP_CODE) ==="
    exit 0
else
    echo "ERROR: Health check failed (HTTP $HTTP_CODE)"
    journalctl -u staynest --no-pager -n 100
    exit 1
fi
