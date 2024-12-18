import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, Activity, AlertTriangle, Sun, Cloud, Wind, 
  Briefcase, Shield, Users, Info, Droplets, HardHat,
  ThermometerSun, Eye, Bell, FileText
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { SafetyDataSection } from '@/components/mine-admin/sections/SafetyDataSection';
import { EnvironmentalDataSection } from '@/components/mine-admin/sections/EnvironmentalDataSection';
import { useAuth } from '@/contexts/AuthContext';

// Mock data definitions remain the same...
const MOCK_PRODUCTION = [
  { month: 'Sep', actual: 520, target: 500 },
  { month: 'Oct', actual: 540, target: 500 },
  { month: 'Nov', actual: 510, target: 500 },
  { month: 'Dec', actual: 530, target: 500 }
].map(item => ({ ...item, actual: item.actual / 1000, target: item.target / 1000 }));

const MOCK_WEATHER = [
  { date: 'Mon', temp: 2, wind: 25, conditions: 'Cloudy', icon: Cloud },
  { date: 'Tue', temp: 1, wind: 20, conditions: 'Snow', icon: Cloud },
  { date: 'Wed', temp: 0, wind: 15, conditions: 'Clear', icon: Sun },
  { date: 'Thu', temp: -2, wind: 18, conditions: 'Rain', icon: Cloud },
  { date: 'Fri', temp: -1, wind: 22, conditions: 'Windy', icon: Wind }
];

const MOCK_JOBS = [
  { id: 1, title: 'Heavy Equipment Operator', location: 'Wabush, NL', department: 'Operations' },
  { id: 2, title: 'Environmental Specialist', location: 'Scully Mine', department: 'Environmental' },
  { id: 3, title: 'Mining Engineer', location: 'Scully Mine', department: 'Engineering' }
];

const MOCK_NOTICES = [
  { id: 1, title: 'BLAST Notice', message: 'Scheduled blast tomorrow at 10:00 AM in Section B-7.', date: 'Dec 15, 2024', type: 'warning' },
  { id: 2, title: 'Safety Alert', message: 'Updated dust protocols in effect for next 3 days due to forecasted high winds.', date: 'Dec 14, 2024', type: 'alert' }
];

const MOCK_SAFETY_TIPS = [
  {
    id: 1,
    title: 'Dust Safety',
    tips: [
      'Wear appropriate PPE including dust masks when in designated areas',
      'Check daily dust forecasts before outdoor activities',
      'Report any unusual dust conditions to supervisors'
    ],
    icon: Eye
  },
  {
    id: 2,
    title: 'Winter Safety',
    tips: [
      'Maintain 3-point contact when climbing equipment',
      'Clear snow and ice from walkways',
      'Check weather conditions before shift start'
    ],
    icon: ThermometerSun
  }
];

const MOCK_AIR_QUALITY = [
  { time: '6AM', pm25: 12, pm10: 25 },
  { time: '9AM', pm25: 15, pm10: 30 },
  { time: '12PM', pm25: 18, pm10: 35 },
  { time: '3PM', pm25: 14, pm10: 28 },
  { time: '6PM', pm25: 11, pm10: 22 }
];

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const OverviewContent = () => (
    <div className="space-y-6">
      {/* Production Chart */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Iron Ore Production</h2>
          <Info className="h-5 w-5 text-gray-400 hover:text-amber-500 cursor-pointer" />
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={MOCK_PRODUCTION}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" stroke="#4B5563" />
            <YAxis label={{ value: 'Tonnes (k)', angle: -90, position: 'insideLeft' }} stroke="#4B5563" />
            <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '0.5rem' }} itemStyle={{ color: '#1A202C' }} />
            <Bar dataKey="actual" fill="#1A202C" name="Actual" radius={[4, 4, 0, 0]} />
            <Bar dataKey="target" fill="#F59E0B" name="Target" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Air Quality and Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Air Quality Trends</h2>
            <Eye className="h-5 w-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={MOCK_AIR_QUALITY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="time" stroke="#4B5563" />
              <YAxis stroke="#4B5563" />
              <Tooltip />
              <Line type="monotone" dataKey="pm25" stroke="#F59E0B" name="PM2.5" />
              <Line type="monotone" dataKey="pm10" stroke="#1A202C" name="PM10" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">5-Day Weather</h2>
            <Cloud className="h-5 w-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-5 text-center gap-4">
            {MOCK_WEATHER.map((day, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg transition-all hover:shadow-md">
                <p className="font-semibold text-gray-700">{day.date}</p>
                <day.icon className="mx-auto w-8 h-8 text-amber-500 my-2" />
                <p className="text-lg font-bold text-gray-800">{day.temp}°C</p>
                <div className="flex items-center justify-center text-gray-600">
                  <Wind className="h-4 w-4 mr-1" />
                  <p>{day.wind}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Safety Tips and Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Safety Tips</h2>
            <HardHat className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {MOCK_SAFETY_TIPS.map(tip => (
              <div key={tip.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <tip.icon className="h-5 w-5 text-amber-500 mr-2" />
                  <h3 className="font-semibold text-gray-800">{tip.title}</h3>
                </div>
                <ul className="list-disc list-inside space-y-1">
                  {tip.tips.map((item, index) => (
                    <li key={index} className="text-gray-600 text-sm">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Community Notices</h2>
            <Bell className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {MOCK_NOTICES.map(notice => (
              <div key={notice.id} className="border-l-4 border-amber-500 bg-amber-50 p-4 rounded-r-lg">
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                  <h3 className="font-semibold text-gray-800">{notice.title}</h3>
                </div>
                <p className="text-gray-600 mt-1">{notice.message}</p>
                <p className="text-sm text-gray-500 mt-1">{notice.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Career Opportunities */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Career Opportunities</h2>
          <Briefcase className="h-5 w-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MOCK_JOBS.map(job => (
            <div key={job.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-all">
              <h3 className="font-semibold text-gray-800">{job.title}</h3>
              <p className="text-sm text-gray-600">{job.location}</p>
              <p className="text-sm text-amber-500">{job.department}</p>
              <button className="mt-2 text-sm text-white bg-amber-500 px-4 py-2 rounded-md hover:bg-amber-600 transition-colors">
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>

      
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'environmental':
        return <EnvironmentalDataSection />;
      case 'safety':
        return <SafetyDataSection />;
      default:
        return <OverviewContent />;
    }
  };

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'environmental', label: 'Environmental Data', icon: Activity },
    { id: 'safety', label: 'Safety Reports', icon: AlertTriangle }
  ];

  const quickLinks = [
    { label: 'Community Guidelines', icon: FileText },
    { label: 'Emergency Contacts', icon: Shield },
    { label: 'Report an Issue', icon: AlertTriangle }
  ];

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b border-gray-800 px-6">
        <h2 className="text-lg text-amber-500">Good Morning, User</h2>
        <div className="flex items-center space-x-4">
          <Bell className="h-5 w-5 " />
          <button 
            className="text-red-500 hover:text-red-400" 
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-[#151922] border-r border-gray-800">
          <div className="p-4 flex items-center space-x-3">
            <Shield className="h-8 w-8 text-amber-500" />
            <span className="text-lg font-semibold text-white">MiSight</span>
          </div>
          
          <nav className="mt-6 px-3">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-2.5 my-1 rounded-md text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-amber-500 text-black'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-8 px-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
            Quick Links
          </h3>
          <div className="space-y-1">
            {quickLinks.map((link, index) => (
              <a
                key={index}
                href="#"
                className="flex items-center px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-md"
              >
                <link.icon className="h-5 w-5 mr-3" />
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-100">
        <div className="max-w-7xl mx-auto p-8">
          <h1 className="text-3xl font-bold text-[#151922] mb-8">Community Dashboard</h1>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#1A1F2B] rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Air Quality Index</p>
                  <h3 className="text-white text-2xl font-bold">Good (32)</h3>
                </div>
                <div className="bg-amber-500 p-2 rounded-lg">
                  <Droplets className="h-6 w-6 text-black" />
                </div>
              </div>
            </div>
            
            <div className="bg-[#1A1F2B] rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Safety Score</p>
                  <h3 className="text-white text-2xl font-bold">98.5%</h3>
                </div>
                <div className="bg-amber-500 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-black" />
                </div>
              </div>
            </div>
            
            <div className="bg-[#1A1F2B] rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Community Projects</p>
                  <h3 className="text-white text-2xl font-bold">12 Active</h3>
                </div>
                <div className="bg-amber-500 p-2 rounded-lg">
                  <Users className="h-6 w-6 text-black" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="space-y-6">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  </div>
);
};

export default UserDashboard;