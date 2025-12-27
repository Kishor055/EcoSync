// Path: src/firebase/client-provider.tsx
'use client';

import {useEffect, useState} from 'react';
import {FirebaseProvider} from './provider';
import {initializeFirebase} from './';

/**
 * Wraps the {@link FirebaseProvider} with a client-side only component that
 * initializes the firebase app. This is to prevent the app from being

 */
export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [firebase, setFirebase] = useState<ReturnType<
    typeof initializeFirebase
  > | null>(null);

  useEffect(() => {
    const firebase = initializeFirebase();
    setFirebase(firebase);
  }, []);

  if (!firebase) {
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
