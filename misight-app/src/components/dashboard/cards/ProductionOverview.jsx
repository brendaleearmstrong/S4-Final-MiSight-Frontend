import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart3, TrendingUp } from 'lucide-react';

const ProductionOverview = () => {
  // Mock production data - in real app would come from API
  const productionData = [
    { label: 'Daily Output', value: '2,450 tonnes', change: '+15%' },
    { label: 'Monthly Target', value: '75,000 tonnes', progress: '82%' },
    { label: 'Equipment Utilization', value: '94%', change: '+2%' },
    { label: 'Processing Efficiency', value: '88%', change: '+5%' }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">
          Production Overview
        </CardTitle>
        <BarChart3 className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {productionData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {item.label}
                </p>
                <p className="text-xl font-bold">{item.value}</p>
              </div>
              {item.change && (
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  {item.change}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductionOverview;