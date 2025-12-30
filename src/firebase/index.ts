'use client';
import {initializeApp, getApp, getApps, type FirebaseApp} from 'firebase/app';
import {getAuth, type Auth} from 'firebase/auth';
import {getFirestore, type Firestore} from 'firebase/firestore';

import {firebaseConfig} from './config';

const firebaseApp: FirebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();
const auth: Auth = getAuth(firebaseApp);
const firestore: Firestore = getFirestore(firebaseApp);

export {firebaseApp, auth, firestore};

export {
  FirebaseProvider,
  useFirebaseApp,
  useAuth,
  useFirestore,
} from './provider';
export {FirebaseClientProvider} from './client-provider';
export {useUser} from './auth/use-user';
export {useCollection} from './firestore/use-collection';
export {useDoc} from './firestore/use-doc';