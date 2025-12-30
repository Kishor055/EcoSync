'use client';

import {FirebaseProvider} from './provider';
import {firebaseApp, auth, firestore} from './';

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
  return (
    <FirebaseProvider app={firebaseApp} auth={auth} firestore={firestore}>
      {children}
    </FirebaseProvider>
  );
}