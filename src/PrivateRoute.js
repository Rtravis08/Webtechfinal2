import React from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    toast.error('You must be logged in to access this page.');
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
