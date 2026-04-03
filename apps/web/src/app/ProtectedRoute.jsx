import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../features/auth/storage/tokenStorage.js';

export function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
