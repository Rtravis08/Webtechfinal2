import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/ReportIncident.css';

const ReportIncident = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    latitude: '',
    longitude: '',
    status: 'pending',
    severity: 'high',
    imageUrl: ''
  });
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    try {
      let imageUrl = '';

      if (imageFile) {
        const imageData = new FormData();
        imageData.append('file', imageFile);
        imageData.append('upload_preset', 'cqc9iiul');

        const imageUploadResponse = await axios.post('https://api.cloudinary.com/v1_1/drpvbvpfh/image/upload', imageData); 
        imageUrl = imageUploadResponse.data.secure_url;
      }

      const incidentResponse = await axios.post(`http://localhost:8080/api/v1/incidents?userId=${userId}`, { ...formData, imageUrl }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const incidentId = incidentResponse.data.incidentId;

      const notificationData = {
        incidentId,
        adminId: userId,
        email: 'example@example.com',
        status: 'SENT',
        message: `Incident with ID: ${incidentId} has been reported.`
      };

      await axios.post('http://localhost:8080/api/v1/notifications', notificationData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      toast.success('Incident reported and notification sent successfully!');
      navigate('/incident-reports');
    } catch (error) {
      toast.error('Failed to report incident. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="report-incident">
      <h2>Report Incident</h2>
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        <label>Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required></textarea>
        <label>Latitude</label>
        <input type="number" name="latitude" value={formData.latitude} onChange={handleChange} required />
        <label>Longitude</label>
        <input type="number" name="longitude" value={formData.longitude} onChange={handleChange} required />
        <label>Image File</label>
        <input type="file" name="imageFile" onChange={handleFileChange} required />
        <button type="submit" className="submit-btn">Submit Report</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ReportIncident;
