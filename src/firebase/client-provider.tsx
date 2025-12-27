'use client';

import {useEffect, useState} from 'react';
import {FirebaseProvider} from './provider';
import {initializeFirebase} from './';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

interface FirebaseInstances {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

/**
 * Wraps the {@link FirebaseProvider} with a client-side only component that
 * initializes the firebase app. This is to prevent the app from being
 * initialized on the server.
 */
export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [firebase, setFirebase] = useState<FirebaseInstances | null>(null);

  useEffect(() => {
    const instances = initializeFirebase();
    setFirebase(instances);
  }, []);

  if (!firebase) {
    // You can show a loading spinner here if you want.
    return null;
  }

  return (
    <FirebaseProvider
      app={firebase.firebaseApp}
      auth={firebase.auth}
      firestore={firebase.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
