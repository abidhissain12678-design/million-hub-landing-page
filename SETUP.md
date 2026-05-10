# SETUP GUIDE

## Step 1: Firebase Project Setup

### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `Million Hub` (or your preferred name)
4. Accept terms and create project
5. Wait for project creation (1-2 minutes)

### Enable Authentication

1. Go to **Build** → **Authentication**
2. Click **Get Started**
3. Enable **Email/Password** sign-in method
4. Save

### Create Firestore Database

1. Go to **Build** → **Firestore Database**
2. Click **Create database**
3. Start in **Test mode** (for development)
4. Select location (closest to you)
5. Create database

### Create Storage Bucket

1. Go to **Build** → **Storage**
2. Click **Get Started**
3. Accept default settings
4. Create bucket

### Get Firebase Credentials

1. Go to **Project Settings** (gear icon)
2. Click **Your apps** section
3. Click on web app icon (< / >)
4. Register app as `million-hub-frontend`
5. Copy your Firebase config

## Step 2: Configure Environment Variables

Create `.env.local` file in `frontend/` directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Step 3: Update Firestore Security Rules

Go to **Firestore Database** → **Rules** and replace with:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to read tasks
    match /tasks/{document=**} {
      allow read: if true;
    }
    
    // Only authenticated admins can write
    match /tasks/{document=**} {
      allow write: if request.auth != null;
    }
  }
}
```

## Step 4: Create Admin User

### In Firebase Console

1. Go to **Authentication** → **Users**
2. Click **Add user**
3. Enter:
   - Email: `admin@millionhub.com`
   - Password: `SecurePassword123!`
4. Create user

### Use in App

1. Run development server: `npm run dev`
2. Visit http://localhost:3000
3. Click "Go to Admin Panel"
4. Login with:
   - Email: `admin@millionhub.com`
   - Password: `SecurePassword123!`

## Step 5: Create First Task

### In Admin Panel

1. Fill in task details:
   - **Task Title**: "Binance Review Task"
   - **Reward Amount**: "500 PKR"
   - **Task Description**: Enter task instructions
   - **CTA Button Text**: "Start Task"
   - **CTA Button Link**: https://example.com
   - **YouTube URL**: https://youtube.com/watch?v=dQw4w9WgXcQ

2. (Optional) Add Ad Links:
   - Top Ad: https://example.com/ad1
   - Middle Ad: https://example.com/ad2
   - Left Sticky Ad: https://example.com/ad3
   - Right Sticky Ad: https://example.com/ad4
   - Bottom Ad: https://example.com/ad5

3. Click "Generate Landing Page"

4. You'll see the new task in the list with:
   - Task title
   - Reward amount
   - Generated slug (e.g., `binance-review-task`)
   - View and Delete buttons

## Step 6: Share Task Landing Page

### View Generated Page

1. Click "View Page" button
2. New tab opens with: `http://localhost:3000/task/binance-review-task`
3. Page shows:
   - Task title and reward
   - Share buttons (WhatsApp, Telegram, Twitter)
   - Task description
   - Embedded YouTube video
   - Sticky ads on sides
   - Call-to-action button
   - Ad banners (top, middle, bottom)

### Share Link

Share the URL: `http://localhost:3000/task/[slug]`

For production: `https://yourdomain.com/task/[slug]`

## Step 7: Development

### Start Dev Server

```bash
cd frontend
npm run dev
```

Visit http://localhost:3000

### Build for Production

```bash
npm run build
npm start
```

### Format Code

```bash
npm run lint
```

## Deployment Options

### Option 1: Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Option 2: Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init
npm run build
firebase deploy
```

### Option 3: Custom Server (Node.js)

```bash
npm run build
npm start
```

Deploy to your server (AWS, DigitalOcean, etc.)

## Troubleshooting

### Firebase Connection Error

**Problem**: "Failed to connect to Firebase"

**Solution**:
1. Check `.env.local` has correct credentials
2. Verify Firebase project is active
3. Check internet connection

### Task Slug Already Exists

**Problem**: Can't create task with same title twice

**Solution**: Change task title or wait a few minutes

### Ads Not Showing

**Problem**: Ad iframes not loading

**Solution**:
1. Check ad links are valid URLs
2. Verify domains allow iframe embedding
3. Check browser console for errors

### YouTube Video Not Playing

**Problem**: "Video unavailable" message

**Solution**:
1. Verify YouTube URL format
2. Check if video is public
3. Try different video

## Next Steps

1. ✅ Set up Firebase
2. ✅ Configure environment variables
3. ✅ Create admin user
4. ✅ Generate first task
5. 📋 Add more tasks
6. 🎨 Customize colors/branding
7. 🚀 Deploy to production
8. 📊 Set up analytics
9. 💰 Add monetization
10. 📈 Grow user base

## Support

For issues:
1. Check console for errors (F12)
2. Verify Firebase credentials
3. Check Firestore database structure
4. Review security rules