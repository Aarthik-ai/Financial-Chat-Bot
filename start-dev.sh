#!/bin/bash

# Arthik.ai Development Startup Script

echo "🚀 Starting Arthik.ai Development Environment..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit .env with your OpenAI API key and database credentials"
    echo "   Run: nano .env"
    echo ""
    echo "Required:"
    echo "  - OPENAI_API_KEY=your_openai_api_key"
    echo "  - DATABASE_URL=postgresql://user:password@localhost:5432/arthik_db"
    echo ""
    read -p "Press Enter after updating .env file..."
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if database exists
echo "🗄️  Checking database..."
if ! psql -lqt | cut -d \| -f 1 | grep -qw arthik_db; then
    echo "🔧 Creating database..."
    createdb arthik_db
fi

# Push database schema
echo "📊 Updating database schema..."
npm run db:push

# Start development server
echo "🎉 Starting development server..."
npm run dev