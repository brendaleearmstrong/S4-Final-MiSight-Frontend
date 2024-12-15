import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';
import {
  Shield, Building2, Activity, AlertTriangle, Cloud, Bell,
  Sun, Wind, FileText, MapPin, Info
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { endpoints, SCULLY_MINE } from '@/services/api';

// Constants
const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#6B7280'];
const PRODUCTION_DATA = [
  { month: 'Sep 2024', actual: 520, target: 500 },
  { month: 'Oct 2024', actual: 540, target: 500 },
  { month: 'Nov 2024', actual: 510, target: 500 },
  { month: 'Dec 2024', actual: 530, target: 500 }
].map(item => ({
  ...item,
  actual: item.actual / 1000,
  target: item.target / 1000
}));

const WEATHER_DATA = [
  { date: '2024-12-15', temp: 2, wind: 25, conditions: 'Cloudy' },
  { date: '2024-12-16', temp: 1, wind: 20, conditions: 'Snow' },
  { date: '2024-12-17', temp: 0, wind: 15, conditions: 'Snow' },
  { date: '2024-12-18', temp: -2, wind: 18, conditions: 'Cloudy' },
  { date: '2024-12-19', temp: -1, wind: 22, conditions: 'Windy' }
];

const COMMUNITY_NOTICES = [
  {
    id: 1,
    title: 'Drilling Blast Notice',
    message: 'Scheduled blast at 10:00 AM tomorrow',
    date: '2024-12-15',
    type: 'alert'
  },
  {
    id: 2,
    title: 'Community Meeting',
    message: 'Environmental review session at 6:00 PM',
    date: '2024-12-16',
    type: 'info'
  },
  {
    id: 3,
    title: 'Dust Alert',
    message: 'High winds expected - additional dust suppression in effect',
    date: '2024-12-17',
    type: 'warning'
  }
];

const NEWS_ITEMS = [
  {
    id: 1,
    title: 'Environmental Achievement',
    content: 'Scully Mine achieves 95% dust reduction target',
    date: '2024-12-14'
  },
  {
    id: 2,
    title: 'Community Investment',
    content: '$50,000 donation to local environmental initiatives',
    date: '2024-12-13'
  }
];

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  // Query hooks
  const { data: environmentalData = [], isLoading: envLoading } = useQuery({
    queryKey: ['environmental-data', SCULLY_MINE.id, dateRange],
    queryFn: () => endpoints.environmentalData.getByMineAndDateRange(
      SCULLY_MINE.id,
      dateRange.start,
      dateRange.end
    )
  });

  const { data: safetyData = [], isLoading: safetyLoading } = useQuery({
    queryKey: ['safety-data', SCULLY_MINE.id, dateRange],
    queryFn: () => endpoints.safetyData.getByMineAndDateRange(
      SCULLY_MINE.id,
      dateRange.start,
      dateRange.end
    )
  });

  // Stats calculations
  const envStats = {
    totalReadings: environmentalData.length,
    exceedances: environmentalData.filter(d => d.measuredValue > d.pollutant?.benchmarkValue).length,
    complianceRate: environmentalData.length ? 
      ((environmentalData.length - environmentalData.filter(d => d.measuredValue > d.pollutant?.benchmarkValue).length) / 
      environmentalData.length * 100).toFixed(1) : 0
  };

  const safetyStats = {
    incidents: safetyData.reduce((sum, record) => sum + record.lostTimeIncidents, 0),
    nearMisses: safetyData.reduce((sum, record) => sum + record.nearMisses, 0),
    daysWithoutIncident: calculateDaysWithoutIncident(safetyData)
  };

  function calculateDaysWithoutIncident(data) {
    if (!data.length) return 0;
    const lastIncident = data
      .filter(d => d.lostTimeIncidents > 0)
      .sort((a, b) => new Date(b.dateRecorded) - new Date(a.dateRecorded))[0];
    
    if (!lastIncident) return data.length;
    
    const lastDate = new Date(lastIncident.dateRecorded);
    const today = new Date();
    return Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
  }

  const renderOverviewSection = () => (
    <div className="space-y-6">
      {/* Production Chart */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Iron Ore Production
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={PRODUCTION_DATA}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis label={{ value: 'Thousands of Tonnes', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="actual" fill="#0284c7" name="Actual Production" />
              <Bar dataKey="target" fill="#9ca3af" name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Environmental Stats */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Environmental</h3>
              <p className="mt-2 text-3xl font-bold">{envStats.complianceRate}%</p>
              <p className="text-sm text-gray-500">Compliance Rate</p>
            </div>
            <Activity className="h-8 w-8 text-green-500" />
          </div>
        </div>

        {/* Safety Stats */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Safety</h3>
              <p className="mt-2 text-3xl font-bold">{safetyStats.daysWithoutIncident}</p>
              <p className="text-sm text-gray-500">Days Without Incident</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-amber-500" />
          </div>
        </div>

        {/* Production Stats */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Production</h3>
              <p className="mt-2 text-3xl font-bold">
                {PRODUCTION_DATA.reduce((sum, item) => sum + item.actual, 0).toFixed(1)}k
              </p>
              <p className="text-sm text-gray-500">Total Production (kt)</p>
            </div>
            <Building2 className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Environmental Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Environmental Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={environmentalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="measurementDate" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="measuredValue" 
                  stroke="#0284c7" 
                  name="Air Quality"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Safety Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Safety Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={safetyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="dateRecorded" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="lostTimeIncidents" 
                  stroke="#ef4444" 
                  name="Incidents"
                />
                <Line 
                  type="monotone" 
                  dataKey="nearMisses" 
                  stroke="#f59e0b" 
                  name="Near Misses"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Community Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notices */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Notices</h3>
          <div className="space-y-4">
            {COMMUNITY_NOTICES.map((notice) => (
              <div 
                key={notice.id} 
                className={`p-4 rounded-lg ${
                  notice.type === 'alert' ? 'bg-red-50' :
                  notice.type === 'warning' ? 'bg-amber-50' :
                  'bg-blue-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-gray-900">{notice.title}</h4>
                  <span className="text-sm text-gray-500">{notice.date}</span>
                </div>
                <p className="mt-1 text-gray-600">{notice.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Weather */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weather Conditions</h3>
          <div className="grid grid-cols-5 gap-4">
            {WEATHER_DATA.map((day, index) => (
              <div key={index} className="text-center">
                <p className="font-medium text-gray-900">
                  {new Date(day.date).toLocaleDateString('en-US', { 
                    weekday: 'short' 
                  })}
                </p>
                <div className="my-2">
                  <Sun className="w-8 h-8 mx-auto text-amber-500" />
                </div>
                <p className="text-lg font-bold text-gray-900">{day.temp}°C</p>
                <div className="flex items-center justify-center text-gray-500">
                  <Wind className="w-4 h-4 mr-1" />
                  <span>{day.wind}km/h</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-amber-50 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="text-amber-500 w-5 h-5 mt-1" />
              <div>
                <h4 className="font-semibold text-amber-900">Dust Alert: MODERATE</h4>
                <p className="mt-1 text-amber-700">
                  Current wind conditions may lead to increased dust levels
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'environmental', label: 'Environmental Data', icon: Activity },
    { id: 'safety', label: 'Safety Reports', icon: AlertTriangle },
    { id: 'weather', label: 'Weather & Alerts', icon: Cloud },
    { id: 'notices', label: 'Community Updates', icon: Bell }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'environmental':
        return <div>Environmental Data Section</div>;
      case 'safety':
        return <div>Safety Reports Section</div>;
      case 'weather':
        return <div>Weather & Alerts Section</div>;
      case 'notices':
        return <div>Community Updates Section</div>;
      default:
        return renderOverviewSection();
    }
  };

  // Loading state
  if (envLoading || safetyLoading) {
    return (
      <div className="min-h-screen bg-[#151922] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#151922]">
      {/* Header */}
      <header className="bg-[#1A1F2B] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-amber-500" />
              <div>
                <h1 className="text-xl font-bold text-white">
                  Welcome, {user?.username}
                </h1>
                <span className="text-sm text-gray-400">
                  {SCULLY_MINE.name} - Community Portal
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  localStorage.removeItem('user');
                  navigate('/login');
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-[#1A1F2B] border-r border-gray-800">
          <nav className="mt-5 px-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-3 py-2 my-1 text-sm font-medium rounded-md ${
                  activeTab === item.id
                    ? 'bg-amber-500 text-black'
                    : 'text-gray-300 hover:bg-[#1E2330]'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Date Range Selector */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-gray-400">Date Range:</span>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="bg-[#1E2330] text-white border border-gray-700 rounded px-3 py-2"
                />
                <span className="text-gray-400">to</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="bg-[#1E2330] text-white border border-gray-700 rounded px-3 py-2"
                />
              </div>
            </div>

            {/* Dynamic Content */}
            <div className="space-y-6">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}