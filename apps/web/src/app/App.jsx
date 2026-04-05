import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../features/auth/context/AuthContext.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { LoginPage } from '../features/auth/pages/LoginPage.jsx';
import DashboardPage from '../features/dashboard/pages/DashboardPage.jsx';
import StudentsPage from '../features/students/pages/StudentsPage.jsx';
import AddStudentPage from '../features/students/pages/AddStudentPage.jsx';
import EditStudentPage from '../features/students/pages/EditStudentPage.jsx';
import { Toaster } from 'react-hot-toast';

export function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
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
        <Route
          path="/students/add"
          element={
            <ProtectedRoute>
              <AddStudentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students/edit/:id"
          element={
            <ProtectedRoute>
              <EditStudentPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}