#!/bin/bash

# Docker run script for Kantoku Help Manual

echo "🚀 Starting Kantoku Help Manual container..."

# Stop any existing container
docker stop kantoku-help-manual 2>/dev/null
docker rm kantoku-help-manual 2>/dev/null

# Run the container
docker run -d \
  --name kantoku-help-manual \
  -p 3000:3000 \
  --restart unless-stopped \
  kantoku-help-manual:latest

if [ $? -eq 0 ]; then
    echo "✅ Container started successfully!"
    echo "🌐 Application available at: http://localhost:3000"
    echo ""
    echo "Container commands:"
    echo "  View logs: docker logs kantoku-help-manual"
    echo "  Stop:      docker stop kantoku-help-manual"
    echo "  Restart:   docker restart kantoku-help-manual"
else
    echo "❌ Failed to start container!"
    exit 1
fi
