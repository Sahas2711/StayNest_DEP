// src/services/OwnerService.js
import axios from 'axios';

const API_BASE_URL = `${process.env.REACT_APP_API_BASE_URL || 'https://staynest-alb-1899319045.ap-south-1.elb.amazonaws.com'}/owner`;

const getToken = () => localStorage.getItem('token');

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const registerOwner = async (ownerData) => {
  const response = await axios.post(`${API_BASE_URL}/register`, ownerData);
  return response.data;
};

export const getOwners = async () => {
  const response = await axios.get(`${API_BASE_URL}/getusers`, getAuthHeaders());
  return response.data;
};

export const getCurrentOwner = async () => {
  const response = await axios.get(`${API_BASE_URL}/users/me`, getAuthHeaders());
  return response.data;
};

export const updateOwner = async (updatedOwnerData) => {
  const response = await axios.put(`${API_BASE_URL}/users/update`, updatedOwnerData, getAuthHeaders());
  return response.data;
};

export const deleteOwner = async (ownerData) => {
  const response = await axios.delete(`${API_BASE_URL}/users/delete`, {
    ...getAuthHeaders(),
    data: ownerData,
  });
  return response.data;
};

export const getOwnerById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/users/${id}`, getAuthHeaders());
  return response.data;
};
