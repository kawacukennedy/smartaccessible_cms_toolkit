#!/bin/bash

# Promote Canary Deployment to Production
# Usage: ./promote-canary.sh

set -e

PROJECT_NAME=${VERCEL_PROJECT_NAME:-"smart-cms-web"}

echo "🚀 Promoting canary deployment to production..."

# Get current canary URL
CANARY_URL=$(npx vercel env ls | grep CANARY_URL | awk '{print $3}')

if [ -z "$CANARY_URL" ]; then
    echo "❌ No active canary deployment found"
    exit 1
fi

echo "📊 Promoting $CANARY_URL to production..."

# Deploy canary to production
PROD_URL=$(npx vercel --prod --yes 2>&1 | grep -o 'https://[^ ]*\.vercel\.app')

if [ -z "$PROD_URL" ]; then
    echo "❌ Production deployment failed"
    exit 1
fi

# Update production alias
npx vercel alias set $PROD_URL $PROJECT_NAME --yes

# Clean up canary environment variables
npx vercel env rm CANARY_PERCENTAGE --yes
npx vercel env rm CANARY_URL --yes

echo "✅ Canary promoted to production!"
echo "   Production URL: $PROD_URL"
echo "   Old canary cleaned up"