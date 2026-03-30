#!/bin/bash

# Keep-alive script for Next.js server
cd /home/z/my-project

# Clear cache
rm -rf .next 2>/dev/null

export NEXT_TELEMETRY_DISABLED=1

# Loop infinito para manter o servidor rodando
while true; do
    echo "=== Starting Next.js server ===" >> /tmp/next-keepalive.log
    date >> /tmp/next-keepalive.log
    
    # Iniciar servidor
    bun x next dev -p 3000 --webpack 2>&1 | tee /tmp/next.log
    
    echo "=== Server stopped, restarting in 2 seconds ===" >> /tmp/next-keepalive.log
    sleep 2
done
