# Docker build script for Kantoku Help Manual (PowerShell)

Write-Host "🐳 Building Kantoku Help Manual Docker image..." -ForegroundColor Blue

# Build the production image
docker build -t kantoku-help-manual:latest .

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Docker image built successfully!" -ForegroundColor Green
    Write-Host "📦 Image: kantoku-help-manual:latest" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To run the container:" -ForegroundColor Cyan
    Write-Host "  docker run -p 3000:3000 kantoku-help-manual:latest" -ForegroundColor White
    Write-Host ""
    Write-Host "Or use docker-compose:" -ForegroundColor Cyan
    Write-Host "  docker-compose up" -ForegroundColor White
} else {
    Write-Host "❌ Docker build failed!" -ForegroundColor Red
    exit 1
}
