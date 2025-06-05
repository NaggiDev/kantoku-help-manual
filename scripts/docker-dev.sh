#!/bin/bash

# Docker development script for Kantoku Help Manual

echo "🛠️  Starting Kantoku Help Manual in development mode..."

# Use docker-compose for development
docker-compose -f docker-compose.dev.yml up --build

echo "🌐 Development server available at: http://localhost:3001"
