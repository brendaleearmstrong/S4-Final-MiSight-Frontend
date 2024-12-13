// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Features from './pages/Features';
import Solutions from './pages/Solutions'; 
import Contact from './pages/Contact';
import About from './pages/About';
import Pricing from './pages/Pricing';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import MineAdminDashboard from './pages/dashboards/MineAdminDashboard';
import UserDashboard from './pages/dashboards/UserDashboard';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/features" element={<Features />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/pricing" element={<Pricing />} />

            {/* Protected Dashboard Routes */}
            <Route
              path="/pages/AdminDashboard"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pages/MineAdminDashboard"
              element={
                <ProtectedRoute requiredRole="MINE_ADMIN">
                  <MineAdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pages/UserDashboard"
              element={
                <ProtectedRoute requiredRole="USER">
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;