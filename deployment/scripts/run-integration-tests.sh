#!/bin/bash

# Integration Test Runner for Advanced Features
# Usage: ./run-integration-tests.sh [platform]

set -e

PLATFORM=${1:-"all"}

echo "🧪 Running integration tests for advanced features..."

# Function to run tests for a specific package
run_package_tests() {
  local package=$1
  local package_path="packages/$package"

  if [[ ! -d "$package_path" ]]; then
    echo "❌ Package $package not found"
    return 1
  fi

  echo "📦 Testing $package..."

  cd "$package_path"

  if [[ -f "package.json" ]] && grep -q '"test"' package.json; then
    npm test -- --testPathPattern="integration.test.ts" --passWithNoTests
  else
    echo "⚠️  No test script found for $package"
  fi

  cd - > /dev/null
}

# Run tests based on platform
case $PLATFORM in
    "web")
        run_package_tests "web"
        ;;
    "mobile")
        run_package_tests "mobile"
        ;;
    "cli")
        run_package_tests "cli"
        ;;
    "all")
        run_package_tests "web"
        run_package_tests "mobile"
        run_package_tests "cli"
        ;;
    *)
        echo "❌ Invalid platform: $PLATFORM"
        echo "Usage: $0 [web|mobile|cli|all]"
        exit 1
        ;;
esac

echo "✅ Integration tests completed!"