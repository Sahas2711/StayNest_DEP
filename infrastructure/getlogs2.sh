#!/bin/bash
echo "=== Testing TCP to RDS ==="
timeout 10 bash -c 'cat < /dev/null > /dev/tcp/staynest-postgres.c78iysaicfdh.ap-south-1.rds.amazonaws.com/5432' 2>&1 && echo "TCP OK" || echo "TCP FAILED"
echo "=== Last error from app ==="
journalctl -u staynest --no-pager -n 10 2>&1 | grep -i "psql\|connection\|hikari\|fatal\|caused"
