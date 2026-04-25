#!/bin/bash
echo "=== Stopping service ==="
systemctl stop staynest
sleep 2
echo "=== Starting app manually to capture output ==="
cd /opt/staynest
sudo -u ec2-user bash -c 'source /opt/staynest/app.env && java -jar /opt/staynest/StayNest-0.0.1-SNAPSHOT.jar' 2>&1 &
APP_PID=$!
sleep 50
echo "=== App output ==="
wait $APP_PID 2>/dev/null || true
journalctl -u staynest --no-pager -n 50 2>&1
