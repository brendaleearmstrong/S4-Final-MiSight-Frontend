// src/components/dashboard/NoticesCard.jsx
import { Bell } from 'lucide-react';

export function NoticesCard() {
  const notices = [
    {
      id: 1,
      title: "Safety Protocol Update",
      message: "New ventilation guidelines in effect starting next week",
      date: "2024-03-15"
    },
    {
      id: 2,
      title: "Environmental Report Due",
      message: "Monthly environmental impact reports due by end of week",
      date: "2024-03-14"
    },
    {
      id: 3,
      title: "System Maintenance",
      message: "Scheduled maintenance on monitoring systems this weekend",
      date: "2024-03-13"
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Recent Notices</h2>
        <Bell className="h-5 w-5 text-amber-500" />
      </div>
      
      <div className="space-y-4">
        {notices.map((notice) => (
          <div key={notice.id} className="border-b border-gray-200 pb-4 last:border-0">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-gray-900">{notice.title}</h3>
              <span className="text-sm text-gray-500">{notice.date}</span>
            </div>
            <p className="text-gray-600 mt-1">{notice.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}