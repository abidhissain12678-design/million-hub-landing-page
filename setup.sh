#!/bin/bash

# Million Hub - Quick Setup Script
# Run this script to automatically install dependencies and setup the project

echo "🚀 Million Hub - Task Landing Page Generator"
echo "============================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Navigate to frontend directory
cd frontend || exit

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo ""
    echo "⚠️  No .env.local file found!"
    echo "📝 Creating template .env.local file..."
    
    cat > .env.local << 'EOF'
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
NEXT_PUBLIC_BASE_URL=http://localhost:3000
EOF

    echo ""
    echo "📝 Please update .env.local with your Firebase credentials:"
    echo "   1. Go to https://console.firebase.google.com"
    echo "   2. Create a new project"
    echo "   3. Copy credentials from Project Settings"
    echo "   4. Paste into .env.local"
    echo ""
fi

# Build the project
echo ""
echo "🏗️  Building project..."
npm run build

# Check build status
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Setup complete!"
    echo ""
    echo "🎯 Next steps:"
    echo "   1. Update .env.local with Firebase credentials"
    echo "   2. Run: npm run dev"
    echo "   3. Open: http://localhost:3000"
    echo "   4. Go to: http://localhost:3000/admin"
    echo "   5. Login and create your first task!"
    echo ""
else
    echo ""
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi