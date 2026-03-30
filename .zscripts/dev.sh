#!/bin/bash

# Robust dev script for Partido Liberal
# Don't fail on errors - keep server running
set +e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "=========================================="
echo "Starting Partido Liberal Development Server"
echo "=========================================="

cd "$PROJECT_DIR" || exit 1

# Clear corrupted cache
echo "[1/4] Clearing cache..."
rm -rf "$PROJECT_DIR/.next" 2>/dev/null
rm -rf "$PROJECT_DIR/node_modules/.cache" 2>/dev/null

# Install dependencies
echo "[2/4] Installing dependencies..."
bun install --silent 2>/dev/null

# Try database setup (don't fail if it errors)
echo "[3/4] Setting up database..."
bun run db:push 2>/dev/null || echo "  -> Database setup skipped"

# Start Next.js development server with webpack
echo "[4/4] Starting Next.js dev server..."
echo ""
echo "  ▲ Next.js 16 (webpack)"
echo "  - Local:    http://localhost:3000"
echo "  - Admin:    http://localhost:3000/admin"
echo ""

# Export env var and use webpack for stability
export NEXT_TELEMETRY_DISABLED=1

# Keep trying to start the server
while true; do
    echo "Starting Next.js..."
    bun x next dev -p 3000 --webpack
    echo "Server stopped, restarting in 3 seconds..."
    sleep 3
done
