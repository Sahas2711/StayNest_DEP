import api from './ApiService';

// 🔹 Add a new listing
const addListing = async (listingData) => {
  const res = await api.post('/listing/add', listingData);
  return res.data;
};

// 🔹 Get a specific listing by ID
const getListingById = async (id) => {
  const res = await api.get(`/listing/${id}`);
  return res.data;
};

// 🔹 Get all listings
const getAllListings = async () => {
  
  const res = await api.get('/listing/all');
  return res.data;
};

// 🔹 Update a listing
const updateListing = async (listingData) => {
  const res = await api.put('/listing/update', listingData);
  return res.data;
};

// 🔹 Delete a listing by ID
const deleteListing = async (id) => {
  const res = await api.delete(`/listing/delete/${id}`);
  return res.data;
};

// 🔹 Get listings created by the current owner
const getMyListings = async () => {
  const res = await api.get('/listing/owner/my-listings');
  return res.data;
};

// 🔹 Search listings by area/location
const searchByArea = async (area) => {
  const res = await api.get(`/listing/search/area?location=${encodeURIComponent(area)}`);
  return res.data;
};

// 🔹 Search listings by gender preference
const searchByGender = async (gender) => {
  const res = await api.get(`/listing/search/gender?gender=${encodeURIComponent(gender)}`);
  return res.data;
};

// 🔹 Search listings by budget (less than or equal)
const searchByBudget = async (budget) => {
  const res = await api.get(`/listing/search/budget?budget=${budget}`);
  return res.data;
};

// 🔹 Get owner profile (ID and name)
const getOwnerProfile = async () => {
  const res = await api.get('/listing/owner/profile');
  return res.data;
};

// ✅ Export all API functions
const listingService = {
  addListing,
  getListingById,
  getAllListings,
  updateListing,
  deleteListing,
  getMyListings,
  searchByArea,
  searchByGender,
  searchByBudget,
  getOwnerProfile,
};

export default listingService;
