// src/pages/dashboards/MineAdminDashboard.jsx
export default function MineAdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <h1 className="text-3xl font-bold mb-4">Mine Admin Dashboard</h1>
      <button 
        onClick={() => {
          localStorage.removeItem('user');
          window.location.href = '/login';
        }}
        className="px-4 py-2 bg-amber-500 text-black rounded hover:bg-amber-600"
      >
        Logout
      </button>
    </div>
  );
}