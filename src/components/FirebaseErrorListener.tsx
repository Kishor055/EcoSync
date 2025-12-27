'use client';

import {useEffect} from 'react';
import {errorEmitter} from '@/firebase/error-emitter';

// This is a client-side only component that will listen for
// 'permission-error' events and throw them as uncaught exceptions.
// This is useful for debugging Firestore security rules in development.
export function FirebaseErrorListener() {
  useEffect(() => {
    const onError = (error: any) => {
      throw error;
    };

    errorEmitter.on('permission-error', onError);

    return () => {
      errorEmitter.off('permission-error', onError);
    };
  }, []);

  return null;
}
