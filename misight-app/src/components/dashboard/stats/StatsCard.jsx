// src/components/dashboard/stats/StatsCard.jsx
import { ArrowUp, ArrowDown } from 'lucide-react';

export function StatsCard({ title, value, trend = 0, icon: Icon }) {
  const isPositive = trend > 0;
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
        </div>
        {Icon && <Icon className="h-8 w-8 text-amber-500" />}
      </div>
      
      {trend !== 0 && (
        <div className="mt-4 flex items-center">
          {isPositive ? (
            <ArrowUp className="h-4 w-4 text-green-500" />
          ) : (
            <ArrowDown className="h-4 w-4 text-red-500" />
          )}
          <span className={`text-sm font-medium ml-1 ${
            isPositive ? 'text-green-500' : 'text-red-500'
          }`}>
            {Math.abs(trend)}%
          </span>
        </div>
      )}
    </div>
  );
}