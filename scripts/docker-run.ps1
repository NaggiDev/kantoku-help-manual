# Docker run script for Kantoku Help Manual (PowerShell)

Write-Host "🚀 Starting Kantoku Help Manual container..." -ForegroundColor Blue

# Stop any existing container
docker stop kantoku-help-manual 2>$null
docker rm kantoku-help-manual 2>$null

# Run the container
docker run -d `
  --name kantoku-help-manual `
  -p 3000:3000 `
  --restart unless-stopped `
  kantoku-help-manual:latest

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Container started successfully!" -ForegroundColor Green
    Write-Host "🌐 Application available at: http://localhost:3000" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Container commands:" -ForegroundColor Cyan
    Write-Host "  View logs: docker logs kantoku-help-manual" -ForegroundColor White
    Write-Host "  Stop:      docker stop kantoku-help-manual" -ForegroundColor White
    Write-Host "  Restart:   docker restart kantoku-help-manual" -ForegroundColor White
} else {
    Write-Host "❌ Failed to start container!" -ForegroundColor Red
    exit 1
}
