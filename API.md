# API Documentation

## Overview

This document describes the Million Hub API endpoints and integration points.

## Firebase Firestore Endpoints

### Tasks Collection

#### Get All Tasks

```typescript
// In admin panel
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const querySnapshot = await getDocs(collection(db, 'tasks'));
const tasks = querySnapshot.docs.map(doc => ({
  id: doc.id,
  ...doc.data()
}));
```

**Response:**
```json
[
  {
    "id": "task_001",
    "title": "Binance Review Task",
    "reward": "500 PKR",
    "slug": "binance-review-task",
    "description": "Complete Binance review...",
    "youtubeUrl": "https://youtube.com/watch?v=...",
    "ctaText": "Start Task",
    "ctaLink": "https://example.com",
    "ads": {
      "top": "https://adlink.com/top",
      "middle": "https://adlink.com/mid",
      "left": "https://adlink.com/left",
      "right": "https://adlink.com/right",
      "bottom": "https://adlink.com/bottom"
    },
    "createdAt": "2026-05-09T10:00:00Z",
    "updatedAt": "2026-05-09T10:00:00Z"
  }
]
```

---

#### Get Task by Slug

```typescript
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const q = query(collection(db, 'tasks'), where('slug', '==', 'binance-review-task'));
const querySnapshot = await getDocs(q);
const task = querySnapshot.docs[0]?.data();
```

**Response:**
```json
{
  "title": "Binance Review Task",
  "reward": "500 PKR",
  "slug": "binance-review-task",
  ...
}
```

---

#### Create Task

```typescript
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const taskData = {
  title: "New Task",
  reward: "500 PKR",
  description: "Task description",
  ctaText: "Start",
  ctaLink: "https://example.com",
  youtubeUrl: "https://youtube.com/watch?v=...",
  ads: {
    top: "https://adlink.com/top",
    middle: "https://adlink.com/mid",
    left: "https://adlink.com/left",
    right: "https://adlink.com/right",
    bottom: "https://adlink.com/bottom"
  },
  slug: "new-task",
  createdAt: new Date(),
  updatedAt: new Date()
};

const docRef = await addDoc(collection(db, 'tasks'), taskData);
console.log('Task created with ID:', docRef.id);
```

**Request Body:**
```json
{
  "title": "string (required)",
  "reward": "string (required)",
  "description": "string (required)",
  "ctaText": "string (required)",
  "ctaLink": "string (required)",
  "youtubeUrl": "string (required)",
  "ads": {
    "top": "string (optional)",
    "middle": "string (optional)",
    "left": "string (optional)",
    "right": "string (optional)",
    "bottom": "string (optional)"
  },
  "slug": "string (auto-generated)"
}
```

**Response:**
```json
{
  "id": "task_002",
  "message": "Task created successfully"
}
```

---

#### Update Task

```typescript
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const taskRef = doc(db, 'tasks', 'task_001');
await updateDoc(taskRef, {
  title: "Updated Title",
  updatedAt: new Date()
});
```

**Request Body:**
```json
{
  "title": "string (optional)",
  "reward": "string (optional)",
  "description": "string (optional)",
  ...other fields
}
```

---

#### Delete Task

```typescript
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

await deleteDoc(doc(db, 'tasks', 'task_001'));
```

---

## Authentication Endpoints

### Firebase Auth API

#### Login

```typescript
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const userCredential = await signInWithEmailAndPassword(
  auth,
  'admin@millionhub.com',
  'password123'
);
const user = userCredential.user;
console.log('Login token:', user.getIdToken());
```

**Request:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response:**
```json
{
  "uid": "user_123",
  "email": "admin@millionhub.com",
  "token": "eyJhbGciOiJSUzI1NiIs...",
  "expiresIn": 3600
}
```

---

#### Logout

```typescript
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

await signOut(auth);
```

---

#### Create User

```typescript
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const userCredential = await createUserWithEmailAndPassword(
  auth,
  'admin2@millionhub.com',
  'newpassword123'
);
```

**Request:**
```json
{
  "email": "string (required)",
  "password": "string (required, min 6 chars)"
}
```

---

## Helper Functions

### Generate Slug

```typescript
import { generateSlug } from '@/lib/utils';

const slug = generateSlug('Binance Review Task');
// Output: "binance-review-task"
```

### Generate Short ID

```typescript
import { generateShortId } from '@/lib/utils';

const id = generateShortId();
// Output: "A1B2C3"
```

### Get YouTube Video ID

```typescript
import { getYouTubeVideoId } from '@/lib/utils';

const videoId = getYouTubeVideoId('https://youtube.com/watch?v=dQw4w9WgXcQ');
// Output: "dQw4w9WgXcQ"
```

---

## Real-time Listeners (Future)

### Subscribe to Task Changes

```typescript
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const unsubscribe = onSnapshot(
  collection(db, 'tasks'),
  (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        console.log('New task:', change.doc.data());
      }
      if (change.type === 'modified') {
        console.log('Modified task:', change.doc.data());
      }
      if (change.type === 'removed') {
        console.log('Removed task:', change.doc.id);
      }
    });
  }
);
```

---

## Error Handling

### Common Errors

```typescript
try {
  // Firebase operation
} catch (error) {
  if (error.code === 'auth/user-not-found') {
    console.log('User not found');
  } else if (error.code === 'auth/wrong-password') {
    console.log('Wrong password');
  } else if (error.code === 'permission-denied') {
    console.log('Permission denied');
  } else {
    console.log('Unknown error:', error.message);
  }
}
```

---

## Rate Limiting

Current rate limits (per Firebase free tier):

- **Read Operations**: 50,000 per day
- **Write Operations**: 20,000 per day
- **Delete Operations**: 20,000 per day
- **Concurrent Connections**: 100

Upgrade to Blaze plan for production scale.

---

## Data Validation

### Task Validation Rules

```typescript
const validateTask = (task) => {
  const errors = [];
  
  if (!task.title || task.title.length < 3) {
    errors.push('Title must be at least 3 characters');
  }
  
  if (!task.reward || task.reward.length < 1) {
    errors.push('Reward is required');
  }
  
  if (!task.description || task.description.length < 10) {
    errors.push('Description must be at least 10 characters');
  }
  
  if (!task.ctaText) {
    errors.push('CTA text is required');
  }
  
  if (!isValidUrl(task.ctaLink)) {
    errors.push('Invalid CTA link URL');
  }
  
  if (!isValidYouTubeUrl(task.youtubeUrl)) {
    errors.push('Invalid YouTube URL');
  }
  
  return errors;
};
```

---

## Examples

### Example 1: Create and Share Task

```typescript
// Step 1: Create task
const newTask = {
  title: 'Complete Crypto Quiz',
  reward: '100 PKR',
  description: 'Answer 10 questions about cryptocurrencies',
  ctaText: 'Start Quiz',
  ctaLink: 'https://quiz.example.com',
  youtubeUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
  ads: {
    top: 'https://adnetwork.com/banner1',
    middle: 'https://adnetwork.com/banner2'
  },
  slug: 'complete-crypto-quiz'
};

await addDoc(collection(db, 'tasks'), newTask);

// Step 2: Generate share link
const taskUrl = 'https://millionhub.com/task/complete-crypto-quiz';

// Step 3: Share on social media
const whatsappLink = `https://wa.me/?text=${encodeURIComponent('Complete Crypto Quiz')}&url=${encodeURIComponent(taskUrl)}`;
window.open(whatsappLink);
```

---

### Example 2: Fetch and Display Task

```typescript
// Step 1: Get task by slug from URL
const slug = router.query.slug;

// Step 2: Query Firestore
const q = query(collection(db, 'tasks'), where('slug', '==', slug));
const snapshot = await getDocs(q);
const task = snapshot.docs[0]?.data();

// Step 3: Display task
return (
  <div>
    <h1>{task.title}</h1>
    <p>Reward: {task.reward}</p>
    <iframe src={`https://youtube.com/embed/${videoId}`} />
    <a href={task.ctaLink}>Start Task</a>
  </div>
);
```

---

## Webhooks (Future)

### Task Created Event

```json
{
  "event": "task.created",
  "data": {
    "id": "task_001",
    "title": "New Task",
    "timestamp": "2026-05-09T10:00:00Z"
  }
}
```

### Task Completed Event

```json
{
  "event": "task.completed",
  "data": {
    "id": "task_001",
    "userId": "user_123",
    "reward": "500 PKR",
    "timestamp": "2026-05-09T10:30:00Z"
  }
}
```

---

## SDK Integration

### Install SDK

```bash
npm install firebase
```

### Initialize SDK

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // ... other config
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

---

## Support

For API issues:
1. Check Firebase console
2. Review error logs
3. Verify permissions
4. Contact Firebase support