import { TrendingUp, TrendingDown } from 'lucide-react';

export function StatCard({ title, value, trend, icon: Icon }) {
  const isPositive = trend > 0;
  
  return (
    <div className="rounded-lg border bg-Card text-Card-foreground shadow-sm">
      <div className="p-6 flex flex-col space-y-2">
        <div className="flex items-center justify-between space-x-4">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold">{value}</p>
          {trend !== 0 && (
            <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
}