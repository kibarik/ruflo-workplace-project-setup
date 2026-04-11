#!/bin/bash

# RuFlo V3 Quick Setup Script
# This script initializes the development environment

set -e

echo "🚀 RuFlo V3 Setup"
echo "================"
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js >= 18.0.0"
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

if ! command -v npx &> /dev/null; then
    echo "❌ npx is not available. Please update npm"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install Playwright browsers
echo "🎭 Installing Playwright browsers..."
npx playwright install

# Start Claude-Flow daemon
echo "🤖 Starting Claude-Flow daemon..."
npx -y @claude-flow/cli@latest daemon start &
sleep 3

# Verify setup
echo "🔍 Verifying setup..."
npx -y @claude-flow/cli@latest doctor --fix

echo ""
echo "✅ Setup complete!"
echo ""
echo "📚 Next steps:"
echo "  1. Create your first spec: cp openspec/specs/template.md openspec/specs/my-feature.md"
echo "  2. Write tests: Edit tests/example.spec.ts"
echo "  3. Run tests: npm test"
echo "  4. Start development: In Claude Code, run /openspec-apply-change"
echo ""
echo "📖 Read README.md for detailed documentation"
echo ""
