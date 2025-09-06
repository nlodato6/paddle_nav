// src/api/authApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/fsp';
const ACCOUNTS_URL = 'http://localhost:8000/api/accounts'; // adjust if different

// Helper to get token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Token ${token}` } : {};
};

// --- Authentication ---
// Login: send username/password, store token
export const loginUser = async (username, password) => {
  try {
    const res = await axios.post(`${ACCOUNTS_URL}/api-token-auth/`, {
      username,
      password,
    });
    const token = res.data.token;
    localStorage.setItem('token', token);
    return token;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Signup: create user and store token
export const signupUser = async (username, email, password) => {
  try {
    const res = await axios.post(`${ACCOUNTS_URL}/signup/`, {
      username,
      email,
      password,
    });
    const token = res.data.token;
    localStorage.setItem('token', token);
    return token;
  } catch (error) {
    console.error('Signup failed:', error);
    throw error;
  }
};

// Logout: remove token
export const logoutUser = () => {
  localStorage.removeItem('token');
};

// --- Locations API ---
// Fetch all locations
export const getLocations = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    console.error('Failed to fetch locations:', error);
    throw error;
  }
};

// Fetch user favorites
export const getFavorites = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/locations/favorites/`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    console.error('Failed to fetch favorites:', error);
    throw error;
  }
};

// Favorite a location
export const favoriteLocation = async (id) => {
  try {
    const res = await axios.post(`${BASE_URL}/locations/${id}/favorite/`, null, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    console.error(`Failed to favorite location ${id}:`, error);
    throw error;
  }
};

// Unfavorite a location
export const unfavoriteLocation = async (id) => {
  try {
    const res = await axios.delete(`${BASE_URL}/locations/${id}/unfavorite/`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    console.error(`Failed to unfavorite location ${id}:`, error);
    throw error;
  }
};




// local test -- WORKED!
// export const getLocations = async () => {
//   return [
//     {
//       id: 1,
//       name: "Test Park",
//       description: "A test location",
//       address: "123 Main St",
//       city: "Testville",
//       state: "TS",
//       zip_code: "12345",
//       phone_number: "555-1234",
//       location_category: "State Park",
//       favorited_by_count: 0,
//       is_favorited: false,
//     },
//   ];
// };

// export const favoriteLocation = async (id) => {
//   return { success: true };
// };

// export const unfavoriteLocation = async (id) => {
//   return { success: true };
// };
