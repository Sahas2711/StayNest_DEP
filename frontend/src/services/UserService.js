import api from './ApiService'; // uses interceptor to add JWT token

// Fetch the current user
const getCurrentUser = async () => {
  const res = await api.get('/users/me');
  return res.data;
};

// Get all users (admin only)
const getAllUsers = async () => {
  const res = await api.get('/getusers');
  return res.data;
};

// Update user profile
const updateUser = async (userData) => {
  const res = await api.put('/users/update', userData);
  return res.data;
};

// Delete current user
const deleteUser = async () => {
  const res = await api.delete('/users/delete');
  return res.data;
};

// Get user by ID (admin or user)
const getUserById = async (id) => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};

// Get users by role (e.g., "USER", "OWNER", "ADMIN")
const getUsersByRole = async (role) => {
  const res = await api.get(`/users/role?role=${role}`);
  return res.data;
};

// ✅ Export all functions
const userService = {
  getCurrentUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserById,
  getUsersByRole,
};

export default userService;
