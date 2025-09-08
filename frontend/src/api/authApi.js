// src/api/authApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/fsp';
const ACCOUNTS_URL = 'http://localhost:8000/api/accounts'; // adjust if different

// Helper to get token from localStorage
export const getToken = () => localStorage.getItem("token");
export const getUsername = () => localStorage.getItem("username");

export const setAuth = (token, username) => {
  localStorage.setItem("token", token);
  localStorage.setItem("username", username);
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("locations"); // optional: clear cached API data
};

export const isLoggedIn = () => !!getToken();

export const getAuthHeaders = () => {
  const token = getToken();
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

// Logout
export const logout = () => {
  localStorage.removeItem('token');
};

// Signup: use path without trailing slash (matches your working URL)
export const signupUser = async (username, email, password) => {
  try {
    const res = await axios.post(`${ACCOUNTS_URL}/signup`, {
      username,
      email,
      password,
    });
    const token = res.data.token;
    // store token and username if backend returns them
    localStorage.setItem("token", token);
    localStorage.setItem("username", res.data.username ?? username);
    return token;
  } catch (error) {
    console.error("Signup failed:", error.response?.data || error.message);
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
    const res = await axios.get(`${BASE_URL}/`); // no headers here
    return res.data;
  } catch (error) {
    console.error("Failed to fetch locations:", error.response?.data || error.message);
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

// Favorite a local DB location
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

// Favorite an external API location (ArcGIS)
export const favoriteOfficialLocation = async (OBJECTID) => {
  try {
    const res = await axios.post(`${BASE_URL}/locations/api_favorite/`, { OBJECTID }, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    console.error(`Failed to favorite official location ${OBJECTID}:`, error);
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
