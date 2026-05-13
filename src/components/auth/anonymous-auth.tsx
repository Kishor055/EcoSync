'use client';

import { useEffect } from 'react';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '@/firebase';

export function AnonymousAuth() {
  const auth = useAuth();

  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        signInAnonymously(auth).catch((error) => {
          // Log configuration errors but don't crash the app
          if (error.code === 'auth/configuration-not-found') {
            console.warn("Anonymous sign-in is not enabled in Firebase Console. Authentication will be limited to manual login.");
          } else {
            console.error("Anonymous sign-in failed:", error);
          }
        });
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return null;
}
