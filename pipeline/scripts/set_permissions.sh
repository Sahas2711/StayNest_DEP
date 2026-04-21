#!/bin/bash
set -e

echo "=== Setting file permissions ==="

chown ec2-user:ec2-user /opt/staynest/StayNest-0.0.1-SNAPSHOT.jar
chmod 500 /opt/staynest/StayNest-0.0.1-SNAPSHOT.jar

echo "=== Permissions set ==="
