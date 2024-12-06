import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './components/Login';
import Register from './components/Register';
import DashboardPage from './pages/DashboardPage';
import ReportIncidentPage from './pages/ReportIncidentPage';
import IncidentReportsPage from './pages/IncidentReportsPage';
import CategoryListPage from './pages/CategoryListPage';
import AddIncidentToCategoryPage from './pages/AddIncidentCategoryPage';
import NotificationsPage from './pages/NotificationsPage';
import PrivateRoute from './PrivateRoute';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        } />
        <Route path="/report-incident" element={
          <PrivateRoute>
            <ReportIncidentPage />
          </PrivateRoute>
        } />
        <Route path="/incident-reports" element={
          <PrivateRoute>
            <IncidentReportsPage />
          </PrivateRoute>
        } />
        <Route path="/categories" element={
          <PrivateRoute>
            <CategoryListPage />
          </PrivateRoute>
        } />
        <Route path="/add-incident-to-category" element={
          <PrivateRoute>
            <AddIncidentToCategoryPage />
          </PrivateRoute>
        } />
        <Route path="/notifications" element={
          <PrivateRoute>
            <NotificationsPage />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
