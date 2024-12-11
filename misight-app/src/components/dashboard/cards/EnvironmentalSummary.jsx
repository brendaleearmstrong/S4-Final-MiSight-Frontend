import { motion } from 'framer-motion';
import { Activity, AlertTriangle, Check } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function EnvironmentalSummary({ data }) {
  // Process data for visualization
  const chartData = data.map(item => ({
    date: new Date(item.measurementDate).toLocaleDateString(),
    value: item.measuredValue,
    threshold: item.pollutant.benchmarkValue
  }));

  const currentStatus = data.some(item => item.measuredValue > item.pollutant.benchmarkValue)
    ? 'attention'
    : 'good';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Environmental Status</h3>
        <div className={`flex items-center px-3 py-1 rounded-full ${
          currentStatus === 'good' 
            ? 'bg-green-50 text-green-700' 
            : 'bg-amber-50 text-amber-700'
        }`}>
          {currentStatus === 'good' ? (
            <Check className="w-4 h-4 mr-2" />
          ) : (
            <AlertTriangle className="w-4 h-4 mr-2" />
          )}
          <span className="text-sm font-medium">
            {currentStatus === 'good' ? 'All Parameters Normal' : 'Requires Attention'}
          </span>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip 
              contentStyle={{ 
                background: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#f59e0b" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 8 }}
            />
            <Line 
              type="monotone" 
              dataKey="threshold" 
              stroke="#d97706" 
              strokeDasharray="5 5"
              strokeWidth={1}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Parameters Monitored</p>
          <p className="text-2xl font-bold mt-1">{data.length}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Average Compliance</p>
          <p className="text-2xl font-bold mt-1">98%</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Next Check</p>
          <p className="text-2xl font-bold mt-1">2h</p>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-600 mb-3">Recent Updates</h4>
        <div className="space-y-3">
          {data.slice(0, 3).map((item, index) => (
            <motion.div
              key={index}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3 text-sm"
            >
              <Activity className="w-4 h-4 text-amber-500" />
              <span>{item.pollutant.name}:</span>
              <span className={item.measuredValue > item.pollutant.benchmarkValue 
                ? 'text-amber-600' 
                : 'text-green-600'
              }>
                {item.measuredValue} {item.pollutant.unit}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}