# DEPLOYMENT GUIDE

## Overview

This guide covers deploying the Million Hub Landing Page Generator to production.

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

**Pros:**
- Free tier available
- Automatic deployments from Git
- Built-in Next.js optimization
- Global CDN

**Steps:**

1. Push code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/repo.git
git push -u origin main
```

2. Connect to Vercel

```bash
npm install -g vercel
vercel
```

3. Select your project and framework (Next.js)

4. Add environment variables in Vercel dashboard:
   - Go to Settings → Environment Variables
   - Add all `NEXT_PUBLIC_FIREBASE_*` variables

5. Deploy automatically on git push

**Production URL:** `https://million-hub.vercel.app`

---

### Option 2: Firebase Hosting

**Pros:**
- Same Firebase project
- Good performance
- Free SSL certificate

**Steps:**

1. Install Firebase CLI

```bash
npm install -g firebase-tools
```

2. Initialize Firebase

```bash
firebase login
firebase init hosting
```

3. Choose your Firebase project

4. Set public directory to `.next/standalone/public`

5. Build project

```bash
npm run build
```

6. Deploy

```bash
firebase deploy --only hosting
```

**Production URL:** `https://your-project.firebaseapp.com`

---

### Option 3: Heroku

**Pros:**
- Simple deployment
- Easy scaling

**Steps:**

1. Create Heroku account

2. Install Heroku CLI

```bash
npm install -g heroku
```

3. Login to Heroku

```bash
heroku login
```

4. Create app

```bash
heroku create million-hub
```

5. Add environment variables

```bash
heroku config:set NEXT_PUBLIC_FIREBASE_API_KEY=your_key
heroku config:set NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
# ... add all env variables
```

6. Deploy

```bash
git push heroku main
```

**Production URL:** `https://million-hub.herokuapp.com`

---

### Option 4: AWS (Advanced)

**Pros:**
- Highly scalable
- Production-ready

**Using AWS Amplify:**

1. Push code to GitHub

2. Go to AWS Amplify

3. Connect repository

4. Add environment variables

5. Deploy

---

### Option 5: DigitalOcean (VPS)

**Pros:**
- Full control
- Affordable

**Steps:**

1. Create Ubuntu 22.04 droplet

2. SSH into server

```bash
ssh root@your_server_ip
```

3. Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. Install PM2

```bash
npm install -g pm2
```

5. Clone repository

```bash
git clone https://github.com/yourusername/repo.git
cd repo/frontend
npm install
```

6. Build

```bash
npm run build
```

7. Start with PM2

```bash
pm2 start npm --name "million-hub" -- start
pm2 startup
pm2 save
```

8. Setup Nginx as reverse proxy

```bash
sudo apt-get install nginx
```

Create `/etc/nginx/sites-available/default`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

9. Enable SSL (Let's Encrypt)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Domain Setup

### Add Custom Domain

**Vercel:**
1. Go to Project Settings → Domains
2. Add custom domain
3. Update DNS records

**Firebase Hosting:**
1. Go to Hosting settings
2. Connect custom domain
3. Verify ownership

**DNS Configuration:**

For example.com pointing to Vercel:

```
CNAME    www           million-hub.vercel.app
A record @            76.76.19.21 (Vercel IP)
```

---

## Environment Variables for Production

Create `.env.production.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=prod_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=prod-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=prod-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=prod-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=prod_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=prod_app_id
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

---

## Performance Optimization

### 1. Enable Image Optimization

Next.js optimizes images automatically. No changes needed.

### 2. Enable Compression

```bash
npm install compression
```

### 3. Setup CDN

- Vercel: Automatic
- Firebase: Automatic
- Custom: Use Cloudflare

### 4. Monitor Performance

- Vercel Analytics
- Firebase Performance Monitoring
- Google Lighthouse

---

## Security Checklist

### Before Production

- [ ] Update Firebase security rules
- [ ] Enable HTTPS/SSL
- [ ] Set up custom domain
- [ ] Remove sensitive data from code
- [ ] Review environment variables
- [ ] Enable Firebase Multi-Factor Authentication
- [ ] Setup admin user with strong password
- [ ] Test all features
- [ ] Setup automated backups

### Firebase Security Rules

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read only for tasks
    match /tasks/{document=**} {
      allow read: if true;
      allow write: if false;
    }
    
    // Admin operations
    match /admin/{document=**} {
      allow read, write: if request.auth.uid in get(/databases/$(database)/documents/admins/list).data.uids;
    }
  }
}
```

---

## Monitoring & Maintenance

### Setup Monitoring

1. Enable Firebase Performance Monitoring
2. Setup error logging (Sentry)
3. Monitor server health

### Daily Tasks

- Check admin panel
- Monitor error logs
- Verify tasks are displaying

### Weekly Tasks

- Review analytics
- Check user feedback
- Update tasks if needed

### Monthly Tasks

- Audit security
- Review performance
- Update dependencies

---

## Scaling for Growth

### Phase 1: 1,000 Daily Users
- Vercel hobby plan
- Firebase free tier
- Single region

### Phase 2: 10,000 Daily Users
- Vercel pro plan
- Firebase blaze plan
- Add caching

### Phase 3: 100,000+ Daily Users
- Auto-scaling backend
- Global CDN
- Database replication
- Load balancing

---

## Troubleshooting Deployment

### Firebase Auth Not Working

1. Check API key in `.env`
2. Verify Firebase project is active
3. Check authentication domain in Firebase console

### Images Not Loading

1. Verify Storage bucket permissions
2. Check image URLs are public
3. Test with different image

### Slow Performance

1. Check Next.js build output
2. Enable image optimization
3. Add caching headers

### Database Errors

1. Check Firestore rules
2. Verify collection names
3. Test from Firebase console

---

## Rollback

If something goes wrong:

### Vercel
1. Go to Deployments
2. Click "Redeploy" on previous version

### Firebase Hosting
1. Go to Hosting → Releases
2. Click "Rollback"

### Custom Server
```bash
git revert <commit-hash>
git push
pm2 restart all
```

---

## Support

For deployment issues:
1. Check deployment logs
2. Review error messages
3. Contact provider support
4. Check community forums