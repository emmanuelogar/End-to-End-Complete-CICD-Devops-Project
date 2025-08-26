#!/usr/bin/env bash
set -euo pipefail

echo "🚀 Running EasyShop unit tests..."

# Navigate to project root (if not already)
cd "$(dirname "$0")"

# Ensure dependencies are installed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Run tests with coverage
if npm run | grep -q "test"; then
  echo "✅ Found npm test script. Running..."
  npm test -- --coverage
else
  echo "❌ No test script defined in package.json"
  exit 1
fi

echo "🎉 Tests completed successfully!"
