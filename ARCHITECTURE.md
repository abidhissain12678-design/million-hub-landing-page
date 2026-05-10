# ARCHITECTURE

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     User Landing Page                        │
│  /task/[slug] - Dynamic Page with Task, Video, Ads & CTA   │
└────────────────────────────────────────────────────────────┬┘
                          ▲
                          │
                          │ Fetch by Slug
                          │
                    ┌─────┴──────┐
                    │  Firestore │
                    │   Tasks    │
                    │ Collection │
                    └─────▲──────┘
                          │
                          │ Create/Update/Delete
                          │
        ┌─────────────────┴──────────────────┐
        │       Admin Dashboard              │
        │  /admin - Protected Route          │
        │  Create/Manage Tasks               │
        │  Generate Landing Pages            │
        └───────────────────────────────────┘
        
        Authentication Layer (Firebase Auth)
```

## Frontend Architecture

### Pages Structure

```
src/app/
├── page.tsx                 # Home page / Landing
├── admin/
│   └── page.tsx            # Admin dashboard (protected)
├── task/
│   └── [slug]/
│       └── page.tsx        # Task landing page (dynamic)
└── layout.tsx              # Root layout
```

### Components Structure

```
src/components/
├── AdBanner.tsx            # Horizontal ad banner (top/middle/bottom)
├── StickyAd.tsx            # Fixed sticky ads (left/right)
├── VideoGuide.tsx          # YouTube video embed
├── CTASection.tsx          # Call-to-action button
├── QRCodeGenerator.tsx     # QR code for sharing
├── ShareButtons.tsx        # Social share buttons
└── CountdownTimer.tsx      # Task expiry countdown
```

### Utilities & Types

```
src/lib/
├── firebase.ts             # Firebase initialization & config
└── utils.ts                # Helper functions (slug generation, etc)

src/types/
└── index.ts                # TypeScript interfaces
```

## Data Flow

### Task Creation Flow

```
Admin Input
   ↓
Form Validation
   ↓
Generate Slug
   ↓
Save to Firestore
   ↓
Return Task ID
   ↓
Display in Admin List
   ↓
Provide Shareable Link
```

### Task Display Flow

```
User Visit /task/[slug]
   ↓
Fetch Task by Slug from Firestore
   ↓
Load Task Data
   ↓
Render Components:
  ├── Top Ad Banner
  ├── Task Title & Reward
  ├── Share Buttons
  ├── Task Description
  ├── Middle Ad
  ├── Video Guide
  ├── CTA Section
  ├── Bottom Ad
  └── Sticky Ads
   ↓
Display Page
```

## Database Schema

### Tasks Collection

```firestore
tasks/
├── document_id (auto-generated)
│   ├── title: string
│   ├── reward: string
│   ├── description: string
│   ├── imageUrl: string (optional)
│   ├── ctaText: string
│   ├── ctaLink: string
│   ├── youtubeUrl: string
│   ├── ads: {
│   │   ├── top: string (optional)
│   │   ├── middle: string (optional)
│   │   ├── left: string (optional)
│   │   ├── right: string (optional)
│   │   └── bottom: string (optional)
│   │}
│   ├── slug: string (indexed)
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
└── ...
```

### Authentication (Firebase Auth)

```
Users Collection (auto-managed by Firebase)
├── email: string
├── password: hashed (Firebase managed)
├── uid: string (unique identifier)
└── metadata: { creationTime, lastSignInTime }
```

## Security Architecture

### Authentication Flow

```
User Login
   ↓
Firebase Email/Password Auth
   ↓
Generate Session Token
   ↓
Store in Browser (secure)
   ↓
Include in Firestore Requests
   ↓
Validate Server-side
```

### Authorization Rules

```
┌─────────────────────────────────────┐
│  Public (No Auth Required)          │
├─────────────────────────────────────┤
│ - View task landing pages          │
│ - View tasks (read-only)           │
│ - Access home page                 │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Admin (Auth Required)              │
├─────────────────────────────────────┤
│ - Create tasks                      │
│ - Edit tasks                        │
│ - Delete tasks                      │
│ - View all tasks                    │
│ - Upload images                     │
└─────────────────────────────────────┘
```

### Firestore Security Rules

```firestore
// Tasks: Public read, admin write
match /tasks/{document=**} {
  allow read: if true;
  allow write: if request.auth != null;
}

// Admin panel: Protected routes in frontend
// Server-side validation in middleware (future)
```

## Performance Architecture

### Optimization Strategies

```
Frontend:
├── Image Optimization (Next.js built-in)
├── Code Splitting (Automatic with Next.js)
├── Lazy Loading (React.lazy)
├── Caching (Next.js static generation)
└── CDN Distribution (Vercel/Firebase)

Backend:
├── Firestore Indexing
├── Database Query Optimization
├── Collection Pagination
└── Real-time listener management
```

### Caching Strategy

```
Static Content (Cache: 1 year)
├── CSS files
├── JS bundles
└── Images

Dynamic Content (Cache: 5 minutes)
├── Task pages (with ISR)
├── Admin pages
└── API responses

Real-time (No Cache)
└── Form submissions
```

## Scalability Architecture

### Current Design (1K-10K users)

```
Next.js Frontend
   ↓
Firebase Backend
   ├── Auth
   ├── Firestore Database
   ├── Cloud Storage
   └── Hosting
```

### Future Scalability (100K+ users)

```
Load Balancer
   ├── Next.js Server 1
   ├── Next.js Server 2
   └── Next.js Server N
        ↓
   Firestore Database
   ├── Multi-region replication
   ├── Read replicas
   └── Sharding (if needed)
        ↓
   CDN Layer (Cloudflare)
        ↓
   Cache Layer (Redis)
```

## Integration Points

### Firebase Services Used

```
1. Authentication
   └── Email/Password sign-in
   └── Session management

2. Firestore
   └── Task data storage
   └── Real-time updates (future)

3. Cloud Storage (future)
   └── Task image uploads
   └── Proof image storage

4. Cloud Functions (future)
   └── Auto-generate short links
   └── Send notifications
   └── Analytics processing
```

### External Integrations

```
1. YouTube API (embedded)
   └── Video embedding

2. Ad Networks (iframe)
   └── Ad serving

3. Social Media APIs (future)
   └── WhatsApp integration
   └── Telegram bot

4. Payment Gateways (future)
   └── Reward payouts
   └── User withdrawals
```

## Technology Stack Justification

### Frontend: Next.js 14+
- ✅ Server-side rendering support
- ✅ Static generation for performance
- ✅ API routes for serverless functions
- ✅ Built-in image optimization
- ✅ Easy deployment to Vercel

### Styling: Tailwind CSS
- ✅ Utility-first approach
- ✅ Dark theme support
- ✅ Fast development
- ✅ Small bundle size
- ✅ Glassmorphism support

### Backend: Firebase
- ✅ No server management
- ✅ Built-in authentication
- ✅ Real-time database
- ✅ Automatic scaling
- ✅ Free tier available

### TypeScript
- ✅ Type safety
- ✅ Better IDE support
- ✅ Fewer runtime errors
- ✅ Self-documenting code

## Future Architecture Enhancements

### 1. Analytics Service
```
Task Events → Event Logger → Analytics Engine → Dashboard
```

### 2. Short Link Service
```
Generate → Store in DB → Redirect Service → Analytics
```

### 3. Notification System
```
Task Created → Cloud Function → Email/SMS/Push
```

### 4. Admin Backend
```
Next.js Backend → Admin API → Dashboard Analytics
```

### 5. Payment Integration
```
Task Completion → Verify Proof → Process Payment → Update DB
```

## Deployment Architecture

### Development
```
Local Dev → GitHub → Staging (optional)
```

### Production
```
GitHub Push → Vercel Deploy → Firebase Hosting → CDN
```

### Backup Strategy
```
Daily: Firestore automated backups
Weekly: Code repository backups
Monthly: Full system backups
```

## Error Handling Flow

```
Error Occurs
   ↓
Log to Console/Firebase
   ↓
Show User-friendly Message
   ↓
Track in Analytics
   ↓
Alert Admin (future)
   ↓
Document in Issue Tracker
```

## API Rate Limiting (Future)

```
Per User:
├── API Calls: 100/minute
├── Task Creation: 10/day
└── File Uploads: 50/day

Per IP:
├── Anonymous Requests: 30/minute
└── Authenticated: 300/minute
```