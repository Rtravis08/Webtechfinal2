import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <h2>Crime Reporter</h2>
      <ul>
        {role === 'ADMIN' && (
          <>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/categories">Categories</Link></li>
            <li><Link to="/add-incident-to-category">Add Incident to Category</Link></li>
            <li><Link to="/notifications">Notifications</Link></li>
          </>
        )}
        <li><Link to="/report-incident">Report Incident</Link></li>
        <li><Link to="/incident-reports">View Incidents</Link></li>
        <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
      </ul>
    </div>
  );
};

export default Sidebar;
