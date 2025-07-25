#!/bin/bash

# Arthik.ai Local Development Setup Script

echo "🚀 Setting up Arthik.ai for local development..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL is not installed. Please install PostgreSQL."
    echo "   Ubuntu/Debian: sudo apt install postgresql postgresql-contrib"
    echo "   macOS: brew install postgresql"
    echo "   Windows: Download from https://www.postgresql.org/download/windows/"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please edit it with your actual values."
else
    echo "✅ .env file already exists."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if database exists and create if needed
echo "🗄️  Setting up database..."
DB_NAME="arthik_db"
if psql -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    echo "✅ Database $DB_NAME already exists."
else
    echo "🔧 Creating database $DB_NAME..."
    createdb $DB_NAME
    echo "✅ Database $DB_NAME created."
fi

# Push database schema
echo "📊 Pushing database schema..."
npm run db:push

echo ""
echo "🎉 Setup complete! To start the development server, run:"
echo "   npm run dev"
echo ""
echo "📋 Don't forget to:"
echo "   1. Add your OpenAI API key to .env"
echo "   2. Update database credentials in .env if needed"
echo "   3. Configure authentication settings if required"
echo ""
echo "🌐 The application will be available at: http://localhost:5000"