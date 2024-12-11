import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Shield, AlertTriangle } from 'lucide-react';

const SafetyTable = ({ data, isLoading }) => {
  if (isLoading) {
    return <div className="text-center py-4">Loading safety data...</div>;
  }

  const getSafetyLevelBadge = (level) => {
    const styles = {
      CRITICAL: 'bg-red-100 text-red-800',
      FAIR: 'bg-yellow-100 text-yellow-800',
      GOOD: 'bg-green-100 text-green-800',
      EXCELLENT: 'bg-blue-100 text-blue-800'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[level] || 'bg-gray-100 text-gray-800'}`}>
        {level === 'CRITICAL' && <AlertTriangle className="w-3 h-3 mr-1" />}
        {level}
      </span>
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Mine</TableHead>
          <TableHead>Lost Time Incidents</TableHead>
          <TableHead>Near Misses</TableHead>
          <TableHead>Safety Level</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((record) => (
          <TableRow key={record.id}>
            <TableCell>{new Date(record.dateRecorded).toLocaleDateString()}</TableCell>
            <TableCell>{record.mine.name}</TableCell>
            <TableCell>{record.lostTimeIncidents}</TableCell>
            <TableCell>{record.nearMisses}</TableCell>
            <TableCell>{getSafetyLevelBadge(record.safetyLevel)}</TableCell>
            <TableCell className="max-w-xs truncate">{record.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SafetyTable;