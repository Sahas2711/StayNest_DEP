#!/bin/bash
journalctl -u staynest --no-pager -n 40 2>&1 | tail -40
