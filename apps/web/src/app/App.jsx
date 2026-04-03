import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { LoginPage } from '../features/auth/pages/LoginPage.jsx';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage.jsx';
import { StudentsPage } from '../features/students/pages/StudentsPage.jsx';

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/students"
        element={
          <ProtectedRoute>
            <StudentsPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
