'use client';
import {useEffect, useState} from 'react';
import {
  onSnapshot,
  query,
  collection,
  type FirestoreError,
  type Query,
  type QueryConstraint,
} from 'firebase/firestore';

import {useFirestore} from '@/firebase/provider';

interface CollectionData<T> {
  data: T[];
  loading: boolean;
  error: FirestoreError | null;
}

export function useCollection<T>(path: string | null | undefined): CollectionData<T>;
export function useCollection<T>(query: Query | null | undefined): CollectionData<T>;

export function useCollection<T>(
  pathOrQuery: string | Query | null | undefined,
  ...queryConstraints: QueryConstraint[]
): CollectionData<T> {
  const db = useFirestore();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (!db || !pathOrQuery) {
      if (!pathOrQuery) setLoading(false);
      return;
    }

    let q: Query;
    try {
      if (typeof pathOrQuery === 'string') {
        q = query(collection(db, pathOrQuery), ...queryConstraints);
      } else {
        q = pathOrQuery;
      }

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const data: T[] = [];
          querySnapshot.forEach((doc) => {
            data.push({id: doc.id, ...doc.data()} as T);
          });
          setData(data);
          setLoading(false);
          setError(null);
        },
        (err) => {
          setError(err);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (e: any) {
      console.error("Firestore hook error:", e);
      setLoading(false);
    }
  }, [db, pathOrQuery, JSON.stringify(queryConstraints)]);

  return {data, loading, error};
}
