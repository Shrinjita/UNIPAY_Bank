import React, { useState, useEffect } from 'react';
import { ArrowDown, ArrowUp, Search } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '@/components/ui/select';
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [transactionType, setTransactionType] = useState('all');
  const [status, setStatus] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, 'payments'));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTransactions(data);
      setFilteredTransactions(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = transactions;

    // Search by description
    if (searchTerm.trim()) {
      filtered = filtered.filter(txn =>
        txn.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (transactionType !== 'all') {
      filtered = filtered.filter(txn => txn.type?.toLowerCase() === transactionType);
    }

    // Filter by status
    if (status !== 'all') {
      filtered = filtered.filter(txn => txn.status?.toLowerCase() === status);
    }

    // Filter by date range
    const now = new Date();
    if (dateRange !== 'all') {
      filtered = filtered.filter(txn => {
        const txnDate = new Date(txn.date);
        if (dateRange === 'today') {
          return txnDate.toDateString() === now.toDateString();
        } else if (dateRange === 'week') {
          const oneWeekAgo = new Date(now);
          oneWeekAgo.setDate(now.getDate() - 7);
          return txnDate >= oneWeekAgo && txnDate <= now;
        } else if (dateRange === 'month') {
          return txnDate.getMonth() === now.getMonth() &&
                 txnDate.getFullYear() === now.getFullYear();
        } else if (dateRange === 'year') {
          return txnDate.getFullYear() === now.getFullYear();
        }
        return true;
      });
    }

    setFilteredTransactions(filtered);
  }, [searchTerm, dateRange, transactionType, status, transactions]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">Export CSV</Button>
            <Button variant="outline" size="sm">Export PDF</Button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Search transactions..."
              className="pl-10"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger><SelectValue placeholder="Date Range" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>

          <Select value={transactionType} onValueChange={setTransactionType}>
            <SelectTrigger><SelectValue placeholder="Transaction Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="payment">Payments</SelectItem>
              <SelectItem value="transfer">Transfers</SelectItem>
              <SelectItem value="shopping">Shopping</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="withdrawal">Withdrawal</SelectItem>
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map(transaction => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {new Date(transaction.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      transaction.status === 'Success' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {transaction.amount > 0 ? (
                        <ArrowDown className="text-green-600" size={16} />
                      ) : (
                        <ArrowUp className="text-red-600" size={16} />
                      )}
                      <span className={`${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ${Math.abs(transaction.amount).toFixed(2)}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-6">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="p-4 border-t border-gray-200 flex items-center justify-between">
        <p className="text-sm text-gray-500">Showing {filteredTransactions.length} transactions</p>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;
