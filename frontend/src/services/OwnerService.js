// services/ownerService.js

import axios from 'axios';

const API_BASE_URL = 'https://staynest-backend-dymh.onrender.com/owner'; // change if hosted elsewhere

// Get JWT from localStorage or cookie
const getToken = () => {
  return localStorage.getItem('token'); // or from cookies if you're storing it there
};

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// Register a new owner
export const registerOwner = async (ownerData) => {
  const response = await axios.post(`${API_BASE_URL}/register`, ownerData);
  return response.data;
};

// Get all owners
export const getOwners = async () => {
  const response = await axios.get(`${API_BASE_URL}/getusers`, getAuthHeaders());
  return response.data;
};

// Get current logged-in owner
export const getCurrentOwner = async () => {
  const response = await axios.get(`${API_BASE_URL}/users/me`, getAuthHeaders());
  return response.data;
};

// Update current owner
export const updateOwner = async (updatedOwnerData) => {
  const response = await axios.put(`${API_BASE_URL}/users/update`, updatedOwnerData, getAuthHeaders());
  return response.data;
};

// Delete current owner
export const deleteOwner = async (ownerData) => {
  const response = await axios.delete(`${API_BASE_URL}/users/delete`, {
    ...getAuthHeaders(),
    data: ownerData,
  });
  return response.data;
};

// Get owner by ID
export const getOwnerById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/users/${id}`, getAuthHeaders());
  return response.data;
};
