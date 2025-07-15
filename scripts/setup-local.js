#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, copyFileSync } from 'fs';
import { join } from 'path';

console.log('🚀 Setting up Arthik.ai for local development...\n');

// Check if Node.js version is sufficient
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion < 18) {
    console.error('❌ Node.js version 18 or higher is required. Current version:', nodeVersion);
    process.exit(1);
}

// Check if PostgreSQL is installed
try {
    execSync('psql --version', { stdio: 'pipe' });
    console.log('✅ PostgreSQL is installed');
} catch (error) {
    console.error('❌ PostgreSQL is not installed. Please install PostgreSQL:');
    console.error('   Ubuntu/Debian: sudo apt install postgresql postgresql-contrib');
    console.error('   macOS: brew install postgresql');
    console.error('   Windows: Download from https://www.postgresql.org/download/windows/');
    process.exit(1);
}

// Create .env file if it doesn't exist
const envPath = '.env';
const envExamplePath = '.env.example';

if (!existsSync(envPath)) {
    if (existsSync(envExamplePath)) {
        copyFileSync(envExamplePath, envPath);
        console.log('📝 Created .env file from template');
        console.log('✅ Please edit .env with your actual values\n');
    } else {
        console.error('❌ .env.example file not found');
        process.exit(1);
    }
} else {
    console.log('✅ .env file already exists\n');
}

// Install dependencies
console.log('📦 Installing dependencies...');
try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed\n');
} catch (error) {
    console.error('❌ Failed to install dependencies');
    process.exit(1);
}

// Setup database
console.log('🗄️  Setting up database...');
const dbName = 'arthik_db';

try {
    // Try to create database (it's okay if it already exists)
    execSync(`createdb ${dbName}`, { stdio: 'pipe' });
    console.log(`✅ Database ${dbName} created`);
} catch (error) {
    // Database might already exist, which is fine
    console.log(`✅ Database ${dbName} already exists or created`);
}

// Push database schema
console.log('📊 Pushing database schema...');
try {
    execSync('npm run db:push', { stdio: 'inherit' });
    console.log('✅ Database schema pushed\n');
} catch (error) {
    console.error('❌ Failed to push database schema');
    console.error('Please check your database connection and try again');
    process.exit(1);
}

// Display completion message
console.log('🎉 Setup complete!\n');
console.log('To start the development server, run:');
console.log('   npm run dev\n');
console.log('📋 Don\'t forget to:');
console.log('   1. Add your OpenAI API key to .env');
console.log('   2. Update database credentials in .env if needed');
console.log('   3. Configure authentication settings if required\n');
console.log('🌐 The application will be available at: http://localhost:5000');