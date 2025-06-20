import React, { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

interface Transaction {
  id: string;
  date: string;
  description: string;
  merchant?: string;
  category: string;
  status: string;
  amount: number;
}

interface TransactionTableProps {
  onViewDetails?: (transaction: Transaction) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ onViewDetails }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);

      try {
        const snapshot = await getDocs(collection(db, 'payments'));
        const data: Transaction[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Transaction[]; // type assertion

        // Optional: sort by date descending
        data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setTransactions(data);
      } catch (err) {
        setError('Failed to load transactions.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <p className="p-4 text-center text-gray-500">Loading transactions...</p>;
  if (error) return <p className="p-4 text-center text-red-500">{error}</p>;

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <TableRow
                key={transaction.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => onViewDetails && onViewDetails(transaction)}
              >
                <TableCell className="font-medium whitespace-nowrap">
                  {new Date(transaction.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div>{transaction.description}</div>
                  <div className="text-sm text-gray-500">{transaction.merchantName}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-gray-50">
                    {transaction.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${
                      transaction.status === 'Success'
                        ? 'bg-green-100 text-green-800 hover:bg-green-100'
                        : transaction.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                        : 'bg-green-100 text-green-800 hover:bg-green-100'
                    }`}
                  >
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {transaction.amount > 0 ? (
                      <ArrowDown className="text-green-600" size={16} />
                    ) : (
                      <ArrowUp className="text-red-600" size={16} />
                    )}
                    <span
                      className={`${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      } font-medium`}
                    >
                      ${Math.abs(transaction.amount).toFixed(2)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails && onViewDetails(transaction);
                    }}
                  >
                    <span className="sr-only">View details</span>
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                No transactions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionTable;
