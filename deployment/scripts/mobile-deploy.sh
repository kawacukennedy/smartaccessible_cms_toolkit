#!/bin/bash

# Advanced Mobile Deployment Script for Expo
# Usage: ./mobile-deploy.sh <strategy> [percentage]

set -e

STRATEGY=${1:-"canary"}
PERCENTAGE=${2:-5}

cd packages/mobile

echo "📱 Starting $STRATEGY deployment for mobile app"

case $STRATEGY in
    "canary")
        echo "🐦 Deploying canary release ($PERCENTAGE% rollout)..."

        # Build and submit canary version
        npx eas build --platform all --profile canary --non-interactive
        npx eas submit --platform android --profile canary --rollout $PERCENTAGE
        npx eas submit --platform ios --profile canary --rollout $PERCENTAGE

        echo "✅ Canary deployment submitted!"
        echo "   Rollout: $PERCENTAGE% of users"
        ;;

    "blue-green")
        ENVIRONMENT=${3:-"blue"}
        echo "🔄 Deploying to $ENVIRONMENT environment..."

        npx eas build --platform all --profile $ENVIRONMENT --non-interactive
        npx eas submit --platform android --profile $ENVIRONMENT
        npx eas submit --platform ios --profile $ENVIRONMENT

        echo "✅ $ENVIRONMENT environment deployed!"
        ;;

    "production")
        echo "🚀 Deploying to production..."

        npx eas build --platform all --profile production --non-interactive
        npx eas submit --platform android --profile production
        npx eas submit --platform ios --profile production

        echo "✅ Production deployment complete!"
        ;;

    *)
        echo "❌ Invalid strategy. Use: canary, blue-green, or production"
        exit 1
        ;;
esac

echo ""
echo "📊 Monitor crash reports and user feedback"
echo "🔄 Use './mobile-switch.sh' to switch environments (blue-green only)"