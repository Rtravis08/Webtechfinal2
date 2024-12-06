import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/authenticate', formData);
      toast.success('Login successful!');
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('role', response.data.role);
      navigate('/dashboard');  
    } catch (error) {
      toast.error('Login failed. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          <button type="submit" className="login-btn">Sign In</button>
        </form>
      </div>
      <div className="login-right">
        <h2>Welcome back!</h2>
        <p>Don't have an account?</p>
        <button className="sign-up-btn" onClick={() => navigate('/register')}>Sign Up</button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
