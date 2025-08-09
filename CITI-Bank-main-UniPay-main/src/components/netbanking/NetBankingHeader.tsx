import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserCircle2, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NetBankingHeaderProps {
  title?: string;
  subtitle?: string;
  onBackClick?: () => void;
  showNotification?: boolean;
  userName?: string;
}

const NetBankingHeader: React.FC<NetBankingHeaderProps> = ({
  title = "Net Banking - Fund Transfer",
  subtitle = "Transfer funds to other accounts securely",
  onBackClick,
  showNotification = true,
  userName = "John Doe",
}) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBackClick) onBackClick();
    else navigate('/dashboard');
  };

  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0 mb-8 px-4 md:px-0">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={handleBackClick}
          className="flex items-center gap-2 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          aria-label="Back to dashboard"
        >
          <ArrowLeft size={20} />
          <span className="hidden sm:inline-block font-semibold">Back to Dashboard</span>
        </Button>

        <div>
          <h1 className="text-xl sm:text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 text-sm sm:text-base mt-1">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center space-x-4 justify-end">
        

        
        <span className="hidden sm:inline-block text-sm text-gray-600 bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200 select-none">
          Demo Transaction
        </span>
      </div>
    </header>
  );
};

export default NetBankingHeader;
