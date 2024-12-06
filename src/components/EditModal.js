import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const EditModal = ({ open, handleClose, report, handleUpdate }) => {
  const [formData, setFormData] = useState(report || {});

  useEffect(() => {
    if (report) {
      setFormData(report);
    }
  }, [report]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdate(formData);
    handleClose();
  };

  if (!report) return null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="edit-modal-title"
      aria-describedby="edit-modal-description"
    >
      <Box sx={style}>
        <h2 id="edit-modal-title">Edit Incident</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Latitude"
            name="latitude"
            type="number"
            value={formData.latitude}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Longitude"
            name="longitude"
            type="number"
            value={formData.longitude}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Severity"
            name="severity"
            value={formData.severity}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Image URL"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Save Changes
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default EditModal;
