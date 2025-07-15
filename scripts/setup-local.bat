@echo off
echo 🚀 Setting up Arthik.ai for local development...

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18 or higher.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

:: Check if PostgreSQL is installed
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  PostgreSQL is not installed. Please install PostgreSQL.
    echo    Download from: https://www.postgresql.org/download/windows/
    pause
    exit /b 1
)

:: Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file from template...
    copy .env.example .env
    echo ✅ .env file created. Please edit it with your actual values.
) else (
    echo ✅ .env file already exists.
)

:: Install dependencies
echo 📦 Installing dependencies...
npm install

:: Setup database
echo 🗄️  Setting up database...
set DB_NAME=arthik_db

:: Create database (this may fail if database already exists, which is fine)
createdb %DB_NAME% >nul 2>&1

:: Push database schema
echo 📊 Pushing database schema...
npm run db:push

echo.
echo 🎉 Setup complete! To start the development server, run:
echo    npm run dev
echo.
echo 📋 Don't forget to:
echo    1. Add your OpenAI API key to .env
echo    2. Update database credentials in .env if needed
echo    3. Configure authentication settings if required
echo.
echo 🌐 The application will be available at: http://localhost:5000
pause