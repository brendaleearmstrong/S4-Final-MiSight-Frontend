import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';
import PropTypes from 'prop-types';
function ProtectedRoute({ children, requiredRole }) {
  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    // Redirect to appropriate dashboard based on role
    switch (currentUser.role) {
      case 'ADMIN':
        return <Navigate to="/admin/dashboard" replace />;
      case 'MINE_ADMIN':
        return <Navigate to="/mine-admin/dashboard" replace />;
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }
  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string
};

export default ProtectedRoute;