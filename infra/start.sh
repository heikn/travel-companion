#!/bin/bash
# Quick start script for Docker development environment

set -e

echo "🐳 Starting Travel Companion Docker Environment..."

cd "$(dirname "$0")"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Build and start services
echo "📦 Building containers..."
docker compose build

echo "🚀 Starting services..."
docker compose up -d

echo "⏳ Waiting for database to be ready..."
sleep 5

echo "🔄 Running database migrations..."
docker compose exec -T api yarn prisma migrate deploy

echo ""
echo "✅ All services started successfully!"
echo ""
echo "📍 Access points:"
echo "   Frontend: http://localhost:5173"
echo "   API:      http://localhost:3000"
echo "   Database: localhost:5432"
echo ""
echo "📝 View logs with: docker compose logs -f"
echo "🛑 Stop with:      docker compose down"
echo ""
