import { Filter } from 'lucide-react';

export function FilterDropdown({ options, selected, onSelect }) {
  return (
    <div className="relative">
      <button
        className="inline-flex items-center justify-center rounded-md text-sm font-medium px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50"
      >
        <Filter className="mr-2 h-4 w-4" />
        Filter
      </button>
    </div>
  );
}