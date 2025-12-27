'use client';
import {useEffect, useState} from 'react';
import {
  onSnapshot,
  query,
  collection,
  where,
  limit,
  orderBy,
  startAfter,
  endBefore,
  limitToLast,
  type DocumentData,
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

export function useCollection<T>(path: string): CollectionData<T>;
export function useCollection<T>(query: Query): CollectionData<T>;

export function useCollection<T>(
  pathOrQuery: string | Query,
  ...queryConstraints: QueryConstraint[]
): CollectionData<T> {
  const db = useFirestore();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (!db) {
      return;
    }
    let q: Query;
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
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db, pathOrQuery, ...queryConstraints]);

  return {data, loading, error};
}
