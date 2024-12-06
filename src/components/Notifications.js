import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:8080/api/v1/notifications', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setNotifications(response.data);
      } catch (error) {
        toast.error('Failed to fetch notifications. Please try again.');
        console.error(error);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:8080/api/v1/notifications/${notificationId}`, 
      { status: 'READ' }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.notificationId === notificationId
            ? { ...notification, status: 'READ' }
            : notification
        )
      );
      toast.success('Notification marked as read.');
    } catch (error) {
      toast.error('Failed to mark notification as read. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="notifications">
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.notificationId} className="notification-card">
            <p><strong>Incident ID:</strong> {notification.incidentId}</p>
            <p><strong>Admin ID:</strong> {notification.adminId}</p>
            <p><strong>Email:</strong> {notification.email}</p>
            <p><strong>Status:</strong> {notification.status}</p>
            {notification.status !== 'READ' && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleMarkAsRead(notification.notificationId)}
              >
                Mark as Read
              </Button>
            )}
          </li>
        ))}
      </ul>
      <ToastContainer />
    </div>
  );
};

export default Notifications;
