import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { Transaction } from '@/types/transaction';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Order by Firestore timestamp field, descending (most recent first)
    const q = query(collection(db, 'payments'), orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const txs: Transaction[] = snapshot.docs.map((doc) => {
          const data = doc.data();

          const amountNum = Number(data.amount);

          return {
            id: doc.id,
            // Use Firestore timestamp converted to string, fallback to date string
            date: data.timestamp
              ? data.timestamp.toDate().toLocaleDateString()
              : data.date || '',
            description: data.description || '',
            merchant: data.merchantName || '',
            amount: isNaN(amountNum) ? 0 : amountNum,
            category: data.category || '',
            status: data.status || '',
          };
        });

        setTransactions(txs);
        setLoading(false);
      },
      (err) => {
        console.error('Firestore error:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { transactions, loading, error };
};
