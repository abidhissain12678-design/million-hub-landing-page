import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Suppress Firebase warnings globally
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;

const firebaseWarnings = [
  'GRPC error has no .code',
  'GrpcConnection RPC',
  'Could not reach Cloud Firestore backend',
  'Connection failed',
  '@firebase/firestore',
  'Firestore (12.13.0):'
];

const shouldSuppress = (message: any) => {
  if (!message) return false;
  const str = String(message);
  return firebaseWarnings.some(warning => str.includes(warning));
};

console.error = (...args: any[]) => {
  if (!shouldSuppress(args[0])) {
    originalConsoleError(...args);
  }
};

console.warn = (...args: any[]) => {
  if (!shouldSuppress(args[0])) {
    originalConsoleWarn(...args);
  }
};

console.log = (...args: any[]) => {
  if (!shouldSuppress(args[0])) {
    originalConsoleLog(...args);
  }
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;