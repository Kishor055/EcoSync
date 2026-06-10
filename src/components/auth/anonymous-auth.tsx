'use client';

import { useEffect } from 'react';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { useAuth, useFirestore } from '@/firebase';
import { AuthService } from '@/services/auth.service';

/**
 * Handles seamless background authentication for guest users.
 */
export function AnonymousAuth() {
  const auth = useAuth();
  const db = useFirestore();

  useEffect(() => {
    if (!auth || !db) return;

    const authService = new AuthService(auth, db);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        try {
          const cred = await signInAnonymously(auth);
          // Sync anonymous profile immediately
          await authService.syncProfile(cred.user);
        } catch (error: any) {
          if (error.code === 'auth/configuration-not-found') {
            // Keep it silent here, the landing page will provide the prominent UI warning.
            console.warn("EcoSync: Anonymous sign-in is not enabled in Firebase Console. Manual activation required at: https://console.firebase.google.com/");
          } else {
            console.error("EcoSync: Anonymous sign-in failed:", error);
          }
        }
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  return null;
}
