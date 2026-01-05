// src/services/AuthService.js
import axios from 'axios';
import api from './ApiService'
const API_URL = 'http://localhost:8086'; // update to your backend base URL

const login  = async (data) => {
  const res = await axios.post(`${API_URL}/login/user`, data);
  return res.data;
};

const ownerLogin  = async (data) => {
  const res = await axios.post(`${API_URL}/login/owner`, data);
  return res.data;
};


const registerUser = async (data) => {
  const res = await axios.post(`${API_URL}/register`, data);
  return res.data;
};

const registerOwner = async (data) => {
  const res = await axios.post(`${API_URL}/owner/register`, data);
  return res.data;
};
const forgotPassword = async (email) => {
  const res = await axios.post(`${API_URL}/forgot-password`, { email });
  return res.data;
};

const updatePassword = async (data) => {
  const res = await api.put(`${API_URL}/users/update`, data);
  return res.data;
};
const resetPassword = async (data) => {
  const res = await axios.post(
    `${API_URL}/reset-password?email=${data.email}&newPassword=${data.password}`
  );
  return res.data;
};

// ✅ Named variable export
const authService = {
  login,
  registerUser,
  registerOwner,
  forgotPassword,
  updatePassword,
  ownerLogin,
  resetPassword,
};

export default authService;
