#!/bin/bash

# Mobile Blue-Green Environment Switch
# Usage: ./mobile-switch.sh <environment>

set -e

ENVIRONMENT=${1:-"green"}

if [[ "$ENVIRONMENT" != "blue" && "$ENVIRONMENT" != "green" ]]; then
    echo "❌ Invalid environment. Use 'blue' or 'green'"
    exit 1
fi

cd packages/mobile

echo "🔄 Switching mobile app to $ENVIRONMENT environment..."

# Update app config to point to new environment
if [[ "$ENVIRONMENT" == "blue" ]]; then
    npx expo publish --release-channel blue
else
    npx expo publish --release-channel green
fi

# Update EAS environment
npx eas env:update BLUE_GREEN_ACTIVE $ENVIRONMENT --profile production

echo "✅ Switched to $ENVIRONMENT environment!"
echo "   Release channel: $ENVIRONMENT"
echo "   Users will receive update via OTA"

# Health check via API
echo "🔍 Running health check..."
# Add your health check endpoint here
# curl -f -s "https://your-api.com/health" > /dev/null && echo "✅ API health check passed" || echo "⚠️  API health check failed"