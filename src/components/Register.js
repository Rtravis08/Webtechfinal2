import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    fullName: '',
    phoneNumber: '',
    address: '',
    role: 'ADMIN'  // Default role set to ADMIN
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (/\d/.test(formData.username)) {
      newErrors.username = 'Username must not contain numbers';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one lowercase letter';
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
    } else if (!/[!@#$%^&*]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one special character';
    }
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+250/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must start with +250';
    }
    if (!formData.address) newErrors.address = 'Address is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/register', formData);
      toast.success('Registration successful!');
      localStorage.setItem('token', response.data.token);  // Store token in local storage
      localStorage.setItem('userId', response.data.userId);  // Store userId in local storage
      localStorage.setItem('username', response.data.username);  // Store username in local storage
      localStorage.setItem('role', formData.role);  // Store role in local storage
      navigate('/dashboard');  // Redirect to dashboard
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <h2>Sign Up</h2>
      
        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
          {errors.username && <p className="error">{errors.username}</p>}
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          {errors.email && <p className="error">{errors.email}</p>}
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          {errors.password && <p className="error">{errors.password}</p>}
          <label>Full Name</label>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
          {errors.fullName && <p className="error">{errors.fullName}</p>}
          <label>Phone Number</label>
          <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
          {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}
          <label>Address</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} required />
          {errors.address && <p className="error">{errors.address}</p>}
          <label>Role</label>
          <select name="role" value={formData.role} onChange={handleChange} required>
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
          </select>
          <button type="submit" className="register-btn">Sign Up</button>
        </form>
      </div>
      <div className="register-right">
        <h2>Welcome to register</h2>
        <p>Already have an account?</p>
        <button className="sign-in-btn" onClick={() => navigate('/login')}>Sign In</button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
