'use client';
import {useEffect, useState} from 'react';
import {
  doc,
  onSnapshot,
  type DocumentData,
  type DocumentReference,
  type FirestoreError,
} from 'firebase/firestore';

import {useFirestore} from '@/firebase/provider';

interface DocData<T> {
  data: T | null;
  loading: boolean;
  error: FirestoreError | null;
}

export function useDoc<T>(path: string, id: string): DocData<T>;
export function useDoc<T>(ref: DocumentReference): DocData<T>;

export function useDoc<T>(
  pathOrRef: string | DocumentReference,
  id?: string
): DocData<T> {
  const db = useFirestore();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (!db) {
      return;
    }
    let docRef: DocumentReference;
    if (typeof pathOrRef === 'string') {
      if (!id) {
        throw new Error('ID must be provided when path is a string');
      }
      docRef = doc(db, pathOrRef, id);
    } else {
      docRef = pathOrRef;
    }

    const unsubscribe = onSnapshot(
      docRef,
      (doc) => {
        if (doc.exists()) {
          setData({id: doc.id, ...doc.data()} as T);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db, pathOrRef, id]);

  return {data, loading, error};
}
