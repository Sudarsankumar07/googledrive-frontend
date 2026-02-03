import { Routes, Route, Navigate } from 'react-router-dom';

// Auth components
import Login from '../auth/Login';
import Register from '../auth/Register';
import ForgotPassword from '../auth/ForgotPassword';
import ResetPassword from '../auth/ResetPassword';
import ActivateAccount from '../auth/ActivateAccount';

// Dashboard components
import DashboardLayout from '../layout/DashboardLayout';
import Dashboard from '../dashboard/Dashboard';
import RecentView from '../dashboard/RecentView';
import StarredView from '../dashboard/StarredView';
import TrashView from '../dashboard/TrashView';
import ProfileView from '../dashboard/ProfileView';
import SettingsView from '../dashboard/SettingsView';
import NotificationsView from '../dashboard/NotificationsView';

// Route guards
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password/:token"
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/activate/:token"
        element={<ActivateAccount />}
      />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="recent" element={<RecentView />} />
        <Route path="starred" element={<StarredView />} />
        <Route path="trash" element={<TrashView />} />
        <Route path="profile" element={<ProfileView />} />
        <Route path="settings" element={<SettingsView />} />
        <Route path="notifications" element={<NotificationsView />} />
      </Route>

      {/* Redirects */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
