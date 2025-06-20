
import React from 'react';
import { Button } from '@/components/ui/button';

interface TransactionPaginationProps {
  filteredCount: number;
  totalCount: number;
}

const TransactionPagination: React.FC<TransactionPaginationProps> = ({
  filteredCount,
  totalCount
}) => {
  return (
    <div className="p-4 border-t border-gray-200 flex items-center justify-between">
      <p className="text-sm text-gray-500">
        Showing {totalCount} transactions
      </p>
      
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" disabled>
          Previous
        </Button>
        <Button variant="outline" size="sm">
          Next
        </Button>
      </div>
    </div>
  );
};

export default TransactionPagination;