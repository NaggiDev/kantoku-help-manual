#!/bin/bash

# Docker build script for Kantoku Help Manual

echo "🐳 Building Kantoku Help Manual Docker image..."

# Build the production image
docker build -t kantoku-help-manual:latest .

if [ $? -eq 0 ]; then
    echo "✅ Docker image built successfully!"
    echo "📦 Image: kantoku-help-manual:latest"
    echo ""
    echo "To run the container:"
    echo "  docker run -p 3000:3000 kantoku-help-manual:latest"
    echo ""
    echo "Or use docker-compose:"
    echo "  docker-compose up"
else
    echo "❌ Docker build failed!"
    exit 1
fi
