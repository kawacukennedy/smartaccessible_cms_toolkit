#!/bin/bash

# Blue-Green Deployment Switch Script
# Usage: ./blue-green-switch.sh <environment>

set -e

ENVIRONMENT=${1:-"green"}
PROJECT_NAME=${VERCEL_PROJECT_NAME:-"smart-cms-web"}

if [[ "$ENVIRONMENT" != "blue" && "$ENVIRONMENT" != "green" ]]; then
    echo "❌ Invalid environment. Use 'blue' or 'green'"
    exit 1
fi

echo "🔄 Switching to $ENVIRONMENT environment..."

# Get URLs for both environments
BLUE_URL=$(npx vercel alias ls | grep "${PROJECT_NAME}-blue" | awk '{print $2}')
GREEN_URL=$(npx vercel alias ls | grep "${PROJECT_NAME}-green" | awk '{print $2}')

if [[ "$ENVIRONMENT" == "blue" ]]; then
    if [ -z "$BLUE_URL" ]; then
        echo "❌ Blue environment not found"
        exit 1
    fi
    TARGET_URL=$BLUE_URL
    INACTIVE_ENV="green"
else
    if [ -z "$GREEN_URL" ]; then
        echo "❌ Green environment not found"
        exit 1
    fi
    TARGET_URL=$GREEN_URL
    INACTIVE_ENV="blue"
fi

# Switch production alias
npx vercel alias set $TARGET_URL $PROJECT_NAME --yes

# Update environment variable
npx vercel env add BLUE_GREEN_ACTIVE $ENVIRONMENT --yes

echo "✅ Switched to $ENVIRONMENT environment!"
echo "   Production URL: $TARGET_URL"
echo "   $INACTIVE_ENV environment available for next deployment"

# Health check
echo "🔍 Running health check..."
if curl -f -s "$TARGET_URL/api/health" > /dev/null; then
    echo "✅ Health check passed"
else
    echo "⚠️  Health check failed - manual verification recommended"
fi