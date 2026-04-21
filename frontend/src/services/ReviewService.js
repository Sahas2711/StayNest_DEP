// src/services/ReviewService.js
import axios from 'axios';

const API_BASE_URL = `${process.env.REACT_APP_API_BASE_URL || ''}/review`;

const getToken = () => localStorage.getItem('token');

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
    'Content-Type': 'application/json',
  },
});

export const addReview = async (reviewData) => {
  const response = await axios.post(`${API_BASE_URL}/add`, reviewData, getAuthHeaders());
  return response.data;
};

export const getReviewById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/${id}`);
  return response.data;
};

export const getAllReviews = async () => {
  const response = await axios.get(`${API_BASE_URL}/all`);
  return response.data;
};

export const updateReview = async (reviewData) => {
  const response = await axios.put(`${API_BASE_URL}/update`, reviewData, getAuthHeaders());
  return response.data;
};

export const deleteReviewById = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/delete/${id}`, getAuthHeaders());
  return response.data;
};

export const getReviewsByListing = async (listingId) => {
  const response = await axios.get(`${API_BASE_URL}/listing/${listingId}`);
  return response.data;
};

export const getReviewsByTenant = async (tenantId) => {
  const response = await axios.get(`${API_BASE_URL}/tenant/${tenantId}`);
  return response.data;
};

export const getReviewByOwnerId = async (ownerId) => {
  const response = await axios.get(`${API_BASE_URL}/owner/${ownerId}`);
  return response.data;
};
