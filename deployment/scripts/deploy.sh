#!/bin/bash

# Main Deployment Orchestration Script
# Usage: ./deploy.sh <platform> <strategy> [options]

set -e

PLATFORM=$1
STRATEGY=$2
shift 2

if [[ -z "$PLATFORM" || -z "$STRATEGY" ]]; then
    echo "Usage: ./deploy.sh <platform> <strategy> [options]"
    echo ""
    echo "Platforms: web, mobile, all"
    echo "Strategies:"
    echo "  web:     canary <percentage>, blue-green <env>, production"
    echo "  mobile:  canary <percentage>, blue-green <env>, production"
    echo "  all:     coordinated deployment across platforms"
    echo ""
    echo "Examples:"
    echo "  ./deploy.sh web canary 10"
    echo "  ./deploy.sh mobile blue-green blue"
    echo "  ./deploy.sh all production"
    exit 1
fi

echo "🚀 Starting $STRATEGY deployment for $PLATFORM"

case $PLATFORM in
    "web")
        case $STRATEGY in
            "canary")
                PERCENTAGE=${1:-10}
                ./canary-deploy.sh $PERCENTAGE
                ;;
            "blue-green")
                ENVIRONMENT=${1:-"blue"}
                ./blue-green-switch.sh $ENVIRONMENT
                ;;
            "production")
                ./promote-canary.sh
                ;;
            *)
                echo "❌ Invalid web strategy: $STRATEGY"
                exit 1
                ;;
        esac
        ;;

    "mobile")
        case $STRATEGY in
            "canary")
                PERCENTAGE=${1:-5}
                ./mobile-deploy.sh canary $PERCENTAGE
                ;;
            "blue-green")
                ENVIRONMENT=${1:-"blue"}
                ./mobile-deploy.sh blue-green $ENVIRONMENT
                ;;
            "production")
                ./mobile-deploy.sh production
                ;;
            *)
                echo "❌ Invalid mobile strategy: $STRATEGY"
                exit 1
                ;;
        esac
        ;;

    "all")
        echo "🔄 Coordinated deployment across all platforms..."

        # Deploy web first
        echo "📦 Deploying web..."
        case $STRATEGY in
            "canary")
                PERCENTAGE=${1:-10}
                ./canary-deploy.sh $PERCENTAGE
                ;;
            "production")
                ./promote-canary.sh
                ;;
            *)
                echo "❌ Coordinated deployment only supports canary and production strategies"
                exit 1
                ;;
        esac

        # Deploy mobile
        echo "📱 Deploying mobile..."
        ./mobile-deploy.sh $STRATEGY

        # Monitor both
        echo "📊 Monitoring coordinated deployment..."
        ./monitor-deploy.sh all
        ;;

    *)
        echo "❌ Invalid platform: $PLATFORM"
        exit 1
        ;;
esac

echo "✅ Deployment orchestration complete!"