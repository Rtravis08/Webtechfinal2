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

const EditModal = ({ open, handleClose, category, handleUpdate }) => {
  const [formData, setFormData] = useState({ ...category });

  useEffect(() => {
    setFormData({ ...category });
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdate(formData);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="edit-category-modal-title"
      aria-describedby="edit-category-modal-description"
    >
      <Box sx={style}>
        <h2 id="edit-category-modal-title">Edit Category</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            fullWidth
            label="Category Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            margin="normal"
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
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
