
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface TransactionFiltersProps {
  searchQuery: string;
  dateRange: string;
  transactionType: string;
  amountRange: number[];
  onSearchChange: (value: string) => void;
  onDateRangeChange: (value: string) => void;
  onTransactionTypeChange: (value: string) => void;
  onAmountRangeChange: (value: number[]) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  searchQuery,
  dateRange,
  transactionType,
  amountRange,
  onSearchChange,
  onDateRangeChange,
  onTransactionTypeChange,
  onAmountRangeChange,
  onApplyFilters,
  onResetFilters
}) => {
  return (
    <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <Input 
          placeholder="Search transactions..." 
          className="pl-10"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      {/* Date Range Filter */}
      <Select value={dateRange} onValueChange={onDateRangeChange}>
        <SelectTrigger>
          <SelectValue placeholder="Date Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7days">Last 7 Days</SelectItem>
          <SelectItem value="30days">Last 30 Days</SelectItem>
          <SelectItem value="90days">Last 90 Days</SelectItem>
          <SelectItem value="all">All Time</SelectItem>
        </SelectContent>
      </Select>
      
      {/* Transaction Type Filter */}
      <Select value={transactionType} onValueChange={onTransactionTypeChange}>
        <SelectTrigger>
          <SelectValue placeholder="Transaction Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="payment">Payments</SelectItem>
          <SelectItem value="purchase">Purchases</SelectItem>
          <SelectItem value="withdrawal">Withdrawals</SelectItem>
          <SelectItem value="transfer">Transfers</SelectItem>
          <SelectItem value="income">Income</SelectItem>
          <SelectItem value="subscription">Subscriptions</SelectItem>
        </SelectContent>
      </Select>
      
      {/* Filter Action Buttons */}
      <div className="flex gap-2">
        <Button variant="default" className="flex-1" onClick={onApplyFilters}>
          <Filter size={16} className="mr-1" /> Apply Filters
        </Button>
        <Button variant="outline" onClick={onResetFilters}>Reset</Button>
      </div>
      
      {/* Amount Range Slider */}
      {/* <div className="col-span-full">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Amount Range:</span>
          <span className="text-sm font-medium">
            ${amountRange[0].toLocaleString()} - ${amountRange[1].toLocaleString()}
          </span>
        </div>
        <Slider
          value={amountRange}
          min={0}
          max={5000}
          step={100}
          onValueChange={onAmountRangeChange}
          className="mt-2"
        />
      </div> */}
    </div>
  );
};

export default TransactionFilters;