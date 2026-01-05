// services/reviewService.js

import axios from 'axios';

const API_BASE_URL = 'https://staynest-backend-dymh.onrender.com/review'; // Adjust if hosted elsewhere

// Get JWT from localStorage or wherever you store it
const getToken = () => localStorage.getItem('token');

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
     'Content-Type': 'application/json',
  },
});

// ✅ Add a review (user/tenant injected via token)
export const addReview = async (reviewData) => {
  const response = await axios.post(`${API_BASE_URL}/add`, reviewData, getAuthHeaders());
  return response.data;
};

// ✅ Get review by ID
export const getReviewById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/${id}`);
  return response.data;
};

// ✅ Get all reviews
export const getAllReviews = async () => {
  const response = await axios.get(`${API_BASE_URL}/all`);
  return response.data;
};

// ✅ Update a review
export const updateReview = async (reviewData) => {
  const response = await axios.put(`${API_BASE_URL}/update`, reviewData, getAuthHeaders());
  return response.data;
};

// ✅ Delete review by ID
export const deleteReviewById = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/delete/${id}`, getAuthHeaders());
  return response.data;
};

// ✅ Get reviews for a specific listing
export const getReviewsByListing = async (listingId) => {
  const response = await axios.get(`${API_BASE_URL}/listing/${listingId}`);
  return response.data;
};

// ✅ Get reviews for a specific tenant/user
export const getReviewsByTenant = async (tenantId) => {
  const response = await axios.get(`${API_BASE_URL}/tenant/${tenantId}`);
  return response.data;
};

export const getReviewByOwnerId = async (ownerId) => {
  const response = await axios.get(`${API_BASE_URL}/owner/${ownerId}`);
  return response.data;
}