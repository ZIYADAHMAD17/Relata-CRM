import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import Dashboard from '@/pages/Dashboard';
import AuthLayout from '@/layouts/AuthLayout';
import AppLayout from '@/layouts/AppLayout';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import PeopleList from '@/pages/people/PeopleList';
import PersonProfile from '@/pages/people/PersonProfile';
import Tasks from '@/pages/Tasks';
import Meetings from '@/pages/Meetings';
import Analytics from '@/pages/Analytics';
import Documents from '@/pages/Documents';
import Invoices from '@/pages/Invoices';
import Settings from '@/pages/Settings';
import Organizations from '@/pages/Organizations';
import { useAuth } from '@/contexts/AuthContext';

const ProtectedRoute = ({ element, adminOnly = false }: { element: React.ReactElement; adminOnly?: boolean }) => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && user?.role === 'employee') return <Navigate to="/tasks" replace />;
  return element;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected App Routes */}
        <Route element={<AppLayout />}>
          {/* Admin/CEO only routes */}
          <Route path="/dashboard" element={<ProtectedRoute adminOnly element={<Dashboard />} />} />
          <Route path="/people" element={<ProtectedRoute adminOnly element={<PeopleList />} />} />
          <Route path="/people/:id" element={<ProtectedRoute adminOnly element={<PersonProfile />} />} />
          <Route path="/organizations" element={<ProtectedRoute adminOnly element={<Organizations />} />} />

          {/* All roles can access these */}
          <Route path="/tasks" element={<ProtectedRoute element={<Tasks />} />} />
          <Route path="/meetings" element={<ProtectedRoute element={<Meetings />} />} />
          <Route path="/analytics" element={<ProtectedRoute element={<Analytics />} />} />
          <Route path="/documents" element={<ProtectedRoute element={<Documents />} />} />
          <Route path="/invoices" element={<ProtectedRoute element={<Invoices />} />} />
          <Route path="/settings" element={<ProtectedRoute element={<Settings />} />} />

          {/* Redirect root app path based on role */}
          <Route path="/app" element={<Navigate to="/tasks" />} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
