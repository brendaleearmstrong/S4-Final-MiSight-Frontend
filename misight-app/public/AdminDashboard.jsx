import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Mountain, Activity, MapPin, AlertTriangle, FileText, Cloud, Plus, Pencil, Trash2, X } from 'lucide-react';
import api from '../../services/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [data, setData] = useState({
    users: [],
    mines: [],
    minerals: [],
    provinces: [],
    notices: [
      { id: 1, title: 'System Update', message: 'New features deployed', date: '2024-03-15' },
      { id: 2, title: 'Maintenance', message: 'Scheduled maintenance', date: '2024-03-16' },
      { id: 3, title: 'Alert', message: 'Environmental threshold update', date: '2024-03-17' }
    ],
    weather: {
      current: { temp: 22, condition: 'Sunny', windSpeed: 12 },
      forecast: [
        { day: 'Today', high: 22, low: 15, condition: 'Sunny' },
        { day: 'Tomorrow', high: 20, low: 14, condition: 'Cloudy' }
      ]
    }
  });

  useEffect(() => {
    if (['mines', 'minerals', 'provinces', 'users'].includes(activeTab)) {
      fetchData();
    }
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let response;
      switch (activeTab) {
        case 'mines':
          response = await api.mines.getAll();
          setData(prev => ({ ...prev, mines: response }));
          break;
        case 'minerals':
          response = await api.minerals.getAll();
          setData(prev => ({ ...prev, minerals: response }));
          break;
        case 'provinces':
          response = await api.provinces.getAll();
          setData(prev => ({ ...prev, provinces: response }));
          break;
        case 'users':
          response = await api.users.getAll();
          setData(prev => ({ ...prev, users: response }));
          break;
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (newItem) => {
    try {
      let response;
      switch (activeTab) {
        case 'mines':
          response = await api.mines.create(newItem);
          break;
        case 'minerals':
          response = await api.minerals.create(newItem);
          break;
        case 'provinces':
          response = await api.provinces.create(newItem);
          break;
        case 'users':
          response = await api.users.create(newItem);
          break;
      }
      fetchData();
      setShowModal(false);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleEdit = async (item) => {
    try {
      switch (activeTab) {
        case 'mines':
          await api.mines.update(item.id, item);
          break;
        case 'minerals':
          await api.minerals.update(item.id, item);
          break;
        case 'provinces':
          await api.provinces.update(item.id, item);
          break;
        case 'users':
          await api.users.update(item.id, item);
          break;
      }
      fetchData();
      setShowModal(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      switch (activeTab) {
        case 'mines':
          await api.mines.delete(id);
          break;
        case 'minerals':
          await api.minerals.delete(id);
          break;
        case 'provinces':
          await api.provinces.delete(id);
          break;
        case 'users':
          await api.users.delete(id);
          break;
      }
      fetchData();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const renderModal = () => {
    const fields = getFieldsForTab(activeTab);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{editingItem ? 'Edit' : 'Add'} {activeTab.slice(0, -1)}</h2>
            <button onClick={() => { setShowModal(false); setEditingItem(null); }}>
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const newItem = Object.fromEntries(formData.entries());
            if (editingItem) {
              handleEdit({ ...editingItem, ...newItem });
            } else {
              handleAdd(newItem);
            }
          }}>
            {fields.map(field => (
              <div key={field.name} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  defaultValue={editingItem?.[field.name] || ''}
                  required
                  className="w-full p-2 border rounded focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            ))}
            
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => { setShowModal(false); setEditingItem(null); }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-amber-500 text-black rounded hover:bg-amber-600"
              >
                {editingItem ? 'Update' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const getFieldsForTab = (tab) => {
    switch (tab) {
      case 'users':
        return [
          { name: 'username', label: 'Username', type: 'text' },
          { name: 'role', label: 'Role', type: 'text' }
        ];
      case 'mines':
        return [
          { name: 'name', label: 'Mine Name', type: 'text' },
          { name: 'location', label: 'Location', type: 'text' },
          { name: 'company', label: 'Company', type: 'text' }
        ];
      case 'minerals':
        return [
          { name: 'name', label: 'Mineral Name', type: 'text' }
        ];
      case 'provinces':
        return [
          { name: 'name', label: 'Province Name', type: 'text' },
          { name: 'code', label: 'Province Code', type: 'text' }
        ];
      default:
        return [];
    }
  };

  const renderContent = () => {
    if (activeTab === 'weather') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Current Weather</h3>
            <div className="text-3xl font-bold mb-2">{data.weather.current.temp}°C</div>
            <div className="text-gray-600">{data.weather.current.condition}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Forecast</h3>
            {data.weather.forecast.map((day, index) => (
              <div key={index} className="mb-4">
                <div className="font-semibold">{day.day}</div>
                <div>{day.high}°C / {day.low}°C</div>
                <div className="text-gray-600">{day.condition}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === 'notices') {
      return (
        <div className="space-y-4">
          {data.notices.map(notice => (
            <div key={notice.id} className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg">{notice.title}</h3>
              <p className="text-gray-600 mt-2">{notice.message}</p>
              <div className="text-sm text-gray-400 mt-2">{notice.date}</div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <>
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-bold">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management</h2>
          <button
            onClick={() => { setEditingItem(null); setShowModal(true); }}
            className="flex items-center px-4 py-2 bg-amber-500 text-black rounded hover:bg-amber-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add {activeTab.slice(0, -1)}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {getFieldsForTab(activeTab).map(field => (
                  <th key={field.name} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {field.label}
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data[activeTab]?.map(item => (
                <tr key={item.id}>
                  {getFieldsForTab(activeTab).map(field => (
                    <td key={field.name} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item[field.name]}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => { setEditingItem(item); setShowModal(true); }}
                      className="text-amber-600 hover:text-amber-900 mr-4"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen bg-[#151922] fixed">
          <div className="p-6 flex items-center">
            <Shield className="h-8 w-8 text-amber-500" />
            <span className="text-white text-xl font-bold ml-2">MiSight</span>
          </div>
          <nav className="mt-6">
            {[
              { id: 'users', label: 'Users', icon: Users },
              { id: 'mines', label: 'Mines', icon: Mountain },
              { id: 'minerals', label: 'Minerals', icon: Mountain },
              { id: 'provinces', label: 'Provinces', icon: MapPin },
              { id: 'notices', label: 'Notices', icon: FileText },
              { id: 'weather', label: 'Weather', icon: Cloud }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-6 py-3 text-sm ${
                  activeTab === item.id 
                    ? 'bg-amber-500 text-black' 
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="ml-64 flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Dashboard</h1>
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

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </div>

      {showModal && renderModal()}
    </div>
  );
}
