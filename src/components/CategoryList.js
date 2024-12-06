import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, IconButton, Modal, Box, TextField, Menu, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/CategoryList.css';
import EditModal from './EditCategoryModal';

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

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:8080/api/v1/categories', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setCategories(response.data);
      } catch (error) {
        toast.error('Failed to fetch categories. Please try again.');
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNewCategory({ name: '', description: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
  };

  const handleMenuClick = (event, category) => {
    setAnchorEl(event.currentTarget);
    setSelectedCategory(category);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCategory(null);
  };

  const handleEdit = () => {
    setEditModalOpen(true);
    handleMenuClose();
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:8080/api/v1/categories/${selectedCategory.categoryId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setCategories(categories.filter(category => category.categoryId !== selectedCategory.categoryId));
      toast.success('Category deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete category. Please try again.');
      console.error(error);
    }
    handleMenuClose();
  };

  const handleUpdate = async (updatedCategory) => {
    const { name, description } = updatedCategory;
    const requestBody = { name, description };
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:8080/api/v1/categories/${updatedCategory.categoryId}`, requestBody, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.categoryId === updatedCategory.categoryId ? response.data : category
        )
      );
      toast.success('Category updated successfully!');
    } catch (error) {
      toast.error('Failed to update category. Please try again.');
      console.error(error);
    }
    setEditModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:8080/api/v1/categories', newCategory, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setCategories([...categories, response.data]);
      toast.success('Category created successfully!');
      handleCloseModal();
    } catch (error) {
      toast.error('Failed to create category. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="category-list">
      <h2>Categories</h2>
      <div className="category-cards">
        {categories.map(category => (
          <div key={category.categoryId} className="category-card">
            <div className="category-header">
              <h3>{category.name}</h3>
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={(event) => handleMenuClick(event, category)}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
              </Menu>
            </div>
            <p>{category.description}</p>
          </div>
        ))}
      </div>
      <IconButton
        aria-label="add"
        color="primary"
        onClick={handleOpenModal}
        className="add-button"
      >
        <AddIcon />
      </IconButton>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="add-category-modal-title"
        aria-describedby="add-category-modal-description"
      >
        <Box sx={style}>
          <h2 id="add-category-modal-title">Add New Category</h2>
          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              fullWidth
              label="Category Name"
              name="name"
              value={newCategory.name}
              onChange={handleChange}
              required
            />
            <TextField
              margin="normal"
              fullWidth
              label="Description"
              name="description"
              value={newCategory.description}
              onChange={handleChange}
              required
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Add Category
            </Button>
          </form>
        </Box>
      </Modal>
      {selectedCategory && (
        <EditModal
          open={editModalOpen}
          handleClose={() => setEditModalOpen(false)}
          category={selectedCategory}
          handleUpdate={handleUpdate}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default CategoryList;
