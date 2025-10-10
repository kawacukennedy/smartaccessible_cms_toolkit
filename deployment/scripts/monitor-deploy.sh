#!/bin/bash

# Deployment Monitoring and Alert Script
# Usage: ./monitor-deploy.sh [platform]

set -e

PLATFORM=${1:-"all"}

echo "📊 Monitoring deployment health..."

# Define thresholds
ERROR_RATE_THRESHOLD=5
RESPONSE_TIME_THRESHOLD=2000
UPTIME_THRESHOLD=99.5

check_web_health() {
    echo "🌐 Checking web deployment health..."

    # Vercel analytics check
    DEPLOYMENT_STATUS=$(npx vercel ls --json | jq -r '.[0].state')

    if [[ "$DEPLOYMENT_STATUS" != "READY" ]]; then
        echo "❌ Web deployment not ready: $DEPLOYMENT_STATUS"
        return 1
    fi

    echo "✅ Web deployment: $DEPLOYMENT_STATUS"

    # Add more health checks here (response time, error rates, etc.)
}

check_mobile_health() {
    echo "📱 Checking mobile deployment health..."

    cd packages/mobile

    # Check Expo build status
    BUILD_STATUS=$(npx eas build:list --json --limit 1 | jq -r '.[0].status')

    if [[ "$BUILD_STATUS" != "finished" ]]; then
        echo "❌ Mobile build not finished: $BUILD_STATUS"
        return 1
    fi

    echo "✅ Mobile build: $BUILD_STATUS"

    # Check store submission status
    # Add store-specific health checks here
}

rollback_deployment() {
    PLATFORM=$1
    echo "🔄 Rolling back $PLATFORM deployment..."

    case $PLATFORM in
        "web")
            # Rollback Vercel deployment
            npx vercel rollback --yes
            ;;
        "mobile")
            # Rollback to previous Expo release
            cd packages/mobile
            npx expo publish --release-channel stable
            ;;
    esac

    echo "✅ Rollback complete for $PLATFORM"
}

# Main monitoring logic
ISSUES_FOUND=0

if [[ "$PLATFORM" == "all" || "$PLATFORM" == "web" ]]; then
    if ! check_web_health; then
        ISSUES_FOUND=1
        if [[ "$AUTO_ROLLBACK" == "true" ]]; then
            rollback_deployment "web"
        fi
    fi
fi

if [[ "$PLATFORM" == "all" || "$PLATFORM" == "mobile" ]]; then
    if ! check_mobile_health; then
        ISSUES_FOUND=1
        if [[ "$AUTO_ROLLBACK" == "true" ]]; then
            rollback_deployment "mobile"
        fi
    fi
fi

if [[ $ISSUES_FOUND -eq 1 ]]; then
    echo "❌ Issues detected! Check logs above."
    echo "💡 Consider manual rollback if auto-rollback is disabled"
    exit 1
else
    echo "✅ All deployments healthy!"
fi