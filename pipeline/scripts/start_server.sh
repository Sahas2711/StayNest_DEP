#!/bin/bash
set -e

echo "=== Starting StayNest service ==="

systemctl daemon-reload
systemctl start staynest

# Wait up to 30s for service to be active
for i in $(seq 1 30); do
    if systemctl is-active --quiet staynest; then
        echo "Service started successfully."
        exit 0
    fi
    echo "Waiting for service... ($i/30)"
    sleep 1
done

echo "ERROR: Service failed to start within 30 seconds."
journalctl -u staynest --no-pager -n 50
exit 1
