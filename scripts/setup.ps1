# RuFlo V3 Quick Setup Script (Windows PowerShell)
# This script initializes the development environment

Write-Host "🚀 RuFlo V3 Setup" -ForegroundColor Green
Write-Host "================" -ForegroundColor Green
Write-Host ""

# Check prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "❌ Node.js is not installed. Please install Node.js >= 18.0.0" -ForegroundColor Red
    Write-Host "   Visit: https://nodejs.org/" -ForegroundColor Cyan
    exit 1
}

Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
Write-Host "✅ npm version: $(npm --version)" -ForegroundColor Green
Write-Host ""

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Install Playwright browsers
Write-Host "🎭 Installing Playwright browsers..." -ForegroundColor Yellow
npx playwright install

# Start Claude-Flow daemon
Write-Host "🤖 Starting Claude-Flow daemon..." -ForegroundColor Yellow
Start-Process -FilePath "npx" -ArgumentList "-y","@claude-flow/cli@latest","daemon","start" -NoNewWindow
Start-Sleep -Seconds 3

# Verify setup
Write-Host "🔍 Verifying setup..." -ForegroundColor Yellow
npx -y @claude-flow/cli@latest doctor --fix

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📚 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Create your first spec: Copy openspec/specs/template.md to openspec/specs/my-feature.md"
Write-Host "  2. Write tests: Edit tests/example.spec.ts"
Write-Host "  3. Run tests: npm test"
Write-Host "  4. Start development: In Claude Code, run /openspec-apply-change"
Write-Host ""
Write-Host "📖 Read README.md for detailed documentation" -ForegroundColor Cyan
Write-Host ""
