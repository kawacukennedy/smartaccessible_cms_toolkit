#!/bin/bash

# Advanced Canary Deployment Script for Vercel
# Usage: ./canary-deploy.sh <percentage> <branch>

set -e

PERCENTAGE=${1:-10}
BRANCH=${2:-main}
PROJECT_NAME=${VERCEL_PROJECT_NAME:-"smart-cms-web"}

echo "🚀 Starting canary deployment for $PROJECT_NAME"
echo "📊 Rolling out $PERCENTAGE% of traffic to new version"

# Deploy to preview environment
echo "📦 Deploying to preview environment..."
VERCEL_URL=$(npx vercel --prod=false --yes 2>&1 | grep -o 'https://[^ ]*\.vercel\.app')

if [ -z "$VERCEL_URL" ]; then
    echo "❌ Failed to get preview URL"
    exit 1
fi

echo "✅ Preview deployment successful: $VERCEL_URL"

# Configure traffic splitting
echo "🔀 Configuring traffic split ($PERCENTAGE% to canary)..."
npx vercel alias set $VERCEL_URL $PROJECT_NAME-canary --yes

# Update environment variables for canary percentage
npx vercel env add CANARY_PERCENTAGE $PERCENTAGE --yes
npx vercel env add CANARY_URL $VERCEL_URL --yes

echo "📈 Canary deployment active!"
echo "   - Production: $(expr 100 - $PERCENTAGE)%"
echo "   - Canary: $PERCENTAGE% ($VERCEL_URL)"
echo ""
echo "Monitor metrics and run './promote-canary.sh' when ready to go full production"