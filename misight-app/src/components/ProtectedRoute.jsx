// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { authAPI } from '../services/auth';

function ProtectedRoute({ children, requiredRole }) {
  const isAuthenticated = authAPI.isAuthenticated();
  const hasRequiredRole = requiredRole ? authAPI.hasRole(requiredRole) : true;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRequiredRole) {
    const user = authAPI.getCurrentUser();
    return <Navigate to={authAPI.getProtectedRoute(user?.role)} replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string
};

export default ProtectedRoute;