import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../features/auth/context/AuthContext.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { LoginPage } from '../features/auth/pages/LoginPage.jsx';
import DashboardPage from '../features/dashboard/pages/DashboardPage.jsx';
import StudentsPage from '../features/students/pages/StudentsPage.jsx';
import TeachersPage from "../features/teachers/pages/TeachersPage";

export function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/teachers"
          element={
            <ProtectedRoute>
              <TeachersPage />
            </ProtectedRoute>
          }
        />
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
    </AuthProvider>
  );
}