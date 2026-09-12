# Fix Webpack Error - Clear Next.js Cache and Rebuild

Write-Host "🔧 Fixing Webpack Error..." -ForegroundColor Cyan
Write-Host ""

# Stop any running Next.js process
Write-Host "1. Stopping any running Next.js processes..." -ForegroundColor Yellow
$nextProcesses = Get-Process node -ErrorAction SilentlyContinue | Where-Object { $_.Path -like "*node*" }
if ($nextProcesses) {
    $nextProcesses | Stop-Process -Force
    Write-Host "   ✓ Stopped running processes" -ForegroundColor Green
} else {
    Write-Host "   ✓ No running processes found" -ForegroundColor Green
}

# Delete .next folder
Write-Host ""
Write-Host "2. Deleting .next folder..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Path ".next" -Recurse -Force
    Write-Host "   ✓ Deleted .next folder" -ForegroundColor Green
} else {
    Write-Host "   ✓ .next folder doesn't exist" -ForegroundColor Green
}

# Delete node_modules/.cache
Write-Host ""
Write-Host "3. Clearing node_modules cache..." -ForegroundColor Yellow
if (Test-Path "node_modules/.cache") {
    Remove-Item -Path "node_modules/.cache" -Recurse -Force
    Write-Host "   ✓ Cleared cache" -ForegroundColor Green
} else {
    Write-Host "   ✓ No cache to clear" -ForegroundColor Green
}

Write-Host ""
Write-Host "4. Starting fresh development server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "   Run: npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Cache cleared! Please restart the dev server." -ForegroundColor Green
