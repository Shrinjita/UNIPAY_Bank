
import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string;
  change?: {
    value: string;
    percentage: string;
    positive: boolean;
  };
  icon: React.ReactNode;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, icon, className }) => {
  return (
    <div className={cn(
      "bg-white rounded-lg border border-gray-200 p-5 shadow-sm",
      className
    )}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          
          {change && (
            <div className="flex items-center mt-2">
              <div className={`p-0.5 rounded ${change.positive ? 'bg-green-100' : 'bg-red-100'}`}>
                {change.positive ? (
                  <ArrowUp className="text-green-600" size={12} />
                ) : (
                  <ArrowDown className="text-red-600" size={12} />
                )}
              </div>
              <span className={`text-xs ml-1 ${change.positive ? 'text-green-600' : 'text-red-600'}`}>
                {change.value} ({change.percentage})
              </span>
            </div>
          )}
        </div>
        
        <div className="p-2 rounded-lg bg-purple-50 text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;