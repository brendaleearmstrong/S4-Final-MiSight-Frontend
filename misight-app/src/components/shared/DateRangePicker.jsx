import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

export function DateRangePicker({ startDate, endDate, _onDateChange }) {
  return (
    <div className="relative">
      <button
        className="inline-flex items-center justify-center rounded-md text-sm font-medium px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50"
      >
        <Calendar className="mr-2 h-4 w-4" />
        {startDate && endDate ? (
          <span>
            {format(startDate, 'MMM d, yyyy')} - {format(endDate, 'MMM d, yyyy')}
          </span>
        ) : (
          <span>Select date range</span>
        )}
      </button>
    </div>
  );
}