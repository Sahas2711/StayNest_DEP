#!/bin/bash
echo "=== Testing login directly ==="
curl -v -X POST http://localhost:8080/login/user \
  -H "Content-Type: application/json" \
  -d '{"email":"202301040048@mitaoe.ac.in","password":"Pass12345"}' 2>&1

echo ""
echo "=== Checking recent app logs ==="
journalctl -u staynest --no-pager --since "1 minute ago" 2>&1
