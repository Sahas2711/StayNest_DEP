import api from './ApiService';

// 🔹 Create a new booking
const createBooking = async (bookingData) => {
  const res = await api.post('/api/bookings', bookingData);
  return res.data;
};

// 🔹 Get bookings for current logged-in user
const getMyBookings = async () => {
  const res = await api.get('/api/bookings/user/me');
  return res.data;
};

// 🔹 Get bookings for a specific listing (admin/owner)
const getBookingsByListingId = async (listingId) => {
  const res = await api.get(`/api/bookings/listing/${listingId}`);
  return res.data;
};

// 🔹 Cancel a booking by ID
const cancelBooking = async (bookingId) => {
  const res = await api.put(`/api/bookings/${bookingId}/cancel`);
  return res.data;
};

// 🔹 Get details of a specific booking
const getBookingById = async (bookingId) => {
  const res = await api.get(`/api/bookings/${bookingId}`);
  return res.data;
};

// 🔹 Get bookings filtered by status (admin/owner)
const getBookingsByStatus = async (status) => {
  const res = await api.get(`/api/bookings/status/${status}`);
  return res.data;
};

const getBookingsByOWner = async() =>{
  const res = await api.get('/api/bookings/owner');
  return res.data;
}

const bookingAction = async (bookingId, action) => {
  const res = await api.post(
    `/api/bookings/listing/booking/action?bookingId=${bookingId}&action=${action}`
  );
  return res.data;
};

// ✅ Export all functions
const bookingService = {
  createBooking,
  getMyBookings,
  getBookingsByListingId,
  cancelBooking,
  getBookingById,
  getBookingsByStatus,
  getBookingsByOWner,
  bookingAction
};

export default bookingService;
