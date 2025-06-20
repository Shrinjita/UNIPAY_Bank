
import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { name: 'Jan', amount: 1000 },
  { name: 'Feb', amount: 1500 },
  { name: 'Mar', amount: 1200 },
  { name: 'Apr', amount: 1800 },
  { name: 'May', amount: 2000 },
  { name: 'Jun', amount: 2400 },
  { name: 'Jul', amount: 2100 }
];

const AnalyticsCard = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm h-96">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Transaction Analytics</h2>
        <div>
          <select className="text-sm border rounded-md px-2 py-1">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>Last Year</option>
          </select>
        </div>
      </div>
      
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#888888" tickLine={false} axisLine={false} />
            <YAxis 
              stroke="#888888" 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              formatter={(value: number) => [`$${value}`, 'Amount']}
              contentStyle={{
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke="#7c3aed" 
              fillOpacity={1} 
              fill="url(#colorAmount)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsCard;