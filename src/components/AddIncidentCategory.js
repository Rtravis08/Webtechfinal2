import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, MenuItem, Box } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/AddIncidentToCategory.css';

const AddIncidentToCategory = () => {
  const [incidents, setIncidents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ incidentId: '', categoryId: '' });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const [incidentResponse, categoryResponse] = await Promise.all([
          axios.get('http://localhost:8080/api/v1/incidents', {
            headers: { 'Authorization': `Bearer ${token}` },
          }),
          axios.get('http://localhost:8080/api/v1/categories', {
            headers: { 'Authorization': `Bearer ${token}` },
          }),
        ]);
        setIncidents(incidentResponse.data);
        setCategories(categoryResponse.data);
      } catch (error) {
        toast.error('Failed to fetch data. Please try again.');
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:8080/api/v1/incident-categories', formData, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      toast.success('Incident added to category successfully!');
      setFormData({ incidentId: '', categoryId: '' });
    } catch (error) {
      toast.error('Failed to add incident to category. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="add-incident-to-category">
      <h2>Add Incident to Category</h2>
      <Box component="form" onSubmit={handleSubmit} className="form-box">
        <TextField
          select
          label="Select Incident"
          name="incidentId"
          value={formData.incidentId}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        >
          {incidents.map((incident) => (
            <MenuItem key={incident.incidentId} value={incident.incidentId}>
              {incident.title}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Select Category"
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        >
          {categories.map((category) => (
            <MenuItem key={category.categoryId} value={category.categoryId}>
              {category.name}
            </MenuItem>
          ))}
        </TextField>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Add Incident to Category
        </Button>
      </Box>
      <ToastContainer />
    </div>
  );
};

export default AddIncidentToCategory;
