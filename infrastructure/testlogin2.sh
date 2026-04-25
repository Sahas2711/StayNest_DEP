#!/bin/bash
curl -s -X POST http://localhost:8080/login/user \
  -H "Content-Type: application/json" \
  -d '{"email":"202301040048@mitaoe.ac.in","password":"Pass12345"}' \
  -w "\nHTTP:%{http_code}"
