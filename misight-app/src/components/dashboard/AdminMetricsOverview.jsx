import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';

export function AdminMetricsOverview({ data }) {
  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">System Overview</h3>
        <p className="text-sm text-gray-500">Real-time system performance metrics</p>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="activeUsers" 
              stroke="#8884d8" 
              name="Active Users" 
            />
            <Line 
              type="monotone" 
              dataKey="incidents" 
              stroke="#82ca9d" 
              name="Incidents" 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="text-center">
          <p className="text-sm text-gray-500">System Load</p>
          <p className="text-lg font-semibold">87%</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Response Time</p>
          <p className="text-lg font-semibold">234ms</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Error Rate</p>
          <p className="text-lg font-semibold">0.12%</p>
        </div>
      </div>
    </Card>
  );
}