@echo off
REM Million Hub - Quick Setup Script for Windows
REM Run this script to automatically install dependencies and setup the project

echo.
echo 🚀 Million Hub - Task Landing Page Generator
echo ============================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js version: %NODE_VERSION%
echo.

REM Navigate to frontend directory
cd frontend
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to navigate to frontend directory
    pause
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

REM Check if .env.local exists
if not exist ".env.local" (
    echo.
    echo ⚠️  No .env.local file found!
    echo 📝 Creating template .env.local file...
    
    (
        echo # Firebase Configuration
        echo NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
        echo NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
        echo NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
        echo NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
        echo NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
        echo NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
        echo NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
        echo NEXT_PUBLIC_BASE_URL=http://localhost:3000
    ) > .env.local

    echo.
    echo 📝 Please update .env.local with your Firebase credentials:
    echo    1. Go to https://console.firebase.google.com
    echo    2. Create a new project
    echo    3. Copy credentials from Project Settings
    echo    4. Paste into .env.local
    echo.
)

REM Build the project
echo.
echo 🏗️  Building project...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Build failed. Please check the errors above.
    pause
    exit /b 1
)

echo.
echo ✅ Setup complete!
echo.
echo 🎯 Next steps:
echo    1. Update .env.local with Firebase credentials
echo    2. Run: npm run dev
echo    3. Open: http://localhost:3000
echo    4. Go to: http://localhost:3000/admin
echo    5. Login and create your first task!
echo.
pause