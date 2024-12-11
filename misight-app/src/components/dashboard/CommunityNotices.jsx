import { AlertCircle, Calendar, MessageCircle } from 'lucide-react';

export default function CommunityNotices() {
  // Mock notices - in real app, this would come from backend
  const notices = [
    {
      id: 1,
      type: 'BLAST_NOTICE',
      title: 'Scheduled Blasting Operation',
      content: 'Blasting operations scheduled for December 12th between 2:00 PM and 4:00 PM. Expected moderate vibration in surrounding areas.',
      date: '2024-12-12T14:00:00',
      status: 'upcoming'
    },
    {
      id: 2,
      type: 'ENVIRONMENTAL_UPDATE',
      title: 'Dust Control Measures',
      content: 'Due to forecasted high winds, additional water trucks will be deployed for dust suppression on main haul roads.',
      date: '2024-12-11T08:00:00',
      status: 'active'
    },
    {
      id: 3,
      type: 'COMMUNITY_FEEDBACK',
      title: 'Monthly Environmental Report',
      content: 'November environmental monitoring results show all parameters within permitted limits. Full report available in documents section.',
      date: '2024-12-01T09:00:00',
      comments: 2
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Community Notices</h3>
        <button className="text-amber-600 hover:text-amber-700 text-sm font-medium">
          Create Notice
        </button>
      </div>
      <div className="space-y-4">
        {notices.map((notice) => (
          <div key={notice.id} className="border rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                {notice.type === 'BLAST_NOTICE' ? (
                  <AlertCircle className="h-5 w-5 text-red-500 mt-1" />
                ) : notice.type === 'ENVIRONMENTAL_UPDATE' ? (
                  <AlertCircle className="h-5 w-5 text-yellow-500 mt-1" />
                ) : (
                  <MessageCircle className="h-5 w-5 text-blue-500 mt-1" />
                )}
                <div>
                  <h4 className="font-medium text-gray-900">{notice.title}</h4>
                  <p className="mt-1 text-sm text-gray-600">{notice.content}</p>
                  <div className="mt-2 flex items-center space-x-4">
                    <span className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(notice.date).toLocaleString()}
                    </span>
                    {notice.status && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        notice.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                        notice.status === 'active' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {notice.status}
                      </span>
                    )}
                    {notice.comments !== undefined && (
                      <span className="flex items-center text-sm text-gray-500">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {notice.comments} comments
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}