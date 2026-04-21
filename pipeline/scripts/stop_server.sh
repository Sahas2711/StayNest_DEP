#!/bin/bash
set -e

echo "=== Stopping StayNest service ==="

if systemctl is-active --quiet staynest; then
    systemctl stop staynest
    echo "Service stopped."
else
    echo "Service was not running."
fi
