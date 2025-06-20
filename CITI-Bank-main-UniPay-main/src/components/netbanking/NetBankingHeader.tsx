
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NetBankingHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4 mb-8">
      <Button 
        variant="outline" 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 hover:bg-gray-100"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </Button>
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-gray-900">Net Banking - Fund Transfer</h1>
        <p className="text-gray-600 mt-1">Transfer funds to other accounts securely</p>
      </div>
      <span className="text-sm text-gray-500 bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
        Demo Transaction
      </span>
    </div>
  );
};

export default NetBankingHeader;