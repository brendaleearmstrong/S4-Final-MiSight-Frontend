import * as React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';

export const EnvironmentalChart = ({ data, _loading }) => {
  const [timeRange, setTimeRange] = React.useState('7d');
  const [pollutantType, setPollutantType] = React.useState('all');

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Environmental Monitoring</CardTitle>
          <div className="flex gap-4">
            <Select
              value={pollutantType}
              onChange={(e) => setPollutantType(e.target.value)}
              options={[
                { value: 'all', label: 'All Pollutants' },
                { value: 'air', label: 'Air Quality' },
                { value: 'water', label: 'Water Quality' },
              ]}
            />
            <DateRangePicker
              onChange={setTimeRange}
              value={timeRange}
            />
            <Button variant="outline">Export</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#0284c7" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}