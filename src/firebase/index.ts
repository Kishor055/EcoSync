'use client';
import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { initializeFirestore, type Firestore } from 'firebase/firestore';

import { firebaseConfig } from './config';

/**
 * Enterprise-grade Firebase initialization
 */
const firebaseApp: FirebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

const auth: Auth = getAuth(firebaseApp);

/**
 * Optimized Firestore initialization with Long Polling.
 * experimentalForceLongPolling: true resolves "Could not reach Cloud Firestore backend" 
 * in proxied or restricted dev environments.
 * ignoreUndefinedProperties: true ensures stability when saving partial data.
 */
const firestore: Firestore = initializeFirestore(firebaseApp, {
  experimentalForceLongPolling: true,
  ignoreUndefinedProperties: true,
});

export { firebaseApp, auth, firestore };

export {
  FirebaseProvider,
  useFirebaseApp,
  useAuth,
  useFirestore,
} from './provider';
export { FirebaseClientProvider } from './client-provider';
export { useUser } from './auth/use-user';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
