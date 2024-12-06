import React from 'react';
import '../css/Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="dashboard-content">
        <div className="card">
          <h3>Reports</h3>
          <p>View all the crime reports here.</p>
        </div>
        <div className="card">
          <h3>Statistics</h3>
          <p>View crime statistics and analytics.</p>
        </div>
        <div className="card">
          <h3>Settings</h3>
          <p>Manage your account settings here.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
