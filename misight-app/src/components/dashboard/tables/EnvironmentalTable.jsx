import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { AlertCircle } from 'lucide-react';

const EnvironmentalTable = ({ data, isLoading }) => {
  if (isLoading) {
    return <div className="text-center py-4">Loading environmental data...</div>;
  }

  const isExceedingThreshold = (measurement) => {
    return measurement.measuredValue > measurement.pollutant.benchmarkValue;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Mine</TableHead>
          <TableHead>Pollutant</TableHead>
          <TableHead>Measurement</TableHead>
          <TableHead>Station</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((record) => (
          <TableRow key={record.id}>
            <TableCell>{new Date(record.measurementDate).toLocaleString()}</TableCell>
            <TableCell>{record.mine.name}</TableCell>
            <TableCell>{record.pollutant.name}</TableCell>
            <TableCell>
              {record.measuredValue} {record.pollutant.unit}
              {isExceedingThreshold(record) && (
                <AlertCircle className="inline ml-2 text-red-500 w-4 h-4" />
              )}
            </TableCell>
            <TableCell>{record.monitoringStation.location}</TableCell>
            <TableCell>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                isExceedingThreshold(record) 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {isExceedingThreshold(record) ? 'Exceeding' : 'Normal'}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default EnvironmentalTable;