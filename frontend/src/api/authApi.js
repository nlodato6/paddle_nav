import axios from 'axios';

const BASE_URL = 'http://localhost/api/fsp';
const ACCOUNTS_URL = 'http://localhost/api/accounts'; 

//get token from localStorage
export const getToken = () => localStorage.getItem("token");
export const getUsername = () => localStorage.getItem("username");

export const setAuth = (token, username) => {
  localStorage.setItem("token", token);
  localStorage.setItem("username", username);
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("locations"); 
};

export const isLoggedIn = () => !!getToken();

export const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Token ${token}` } : {};
};

// --- Authentication ---
// Login
export const loginUser = async (username, password) => {
  try {
    const res = await axios.post(`${ACCOUNTS_URL}/api-token-auth/`, {
      username,
      password,
    });
    const token = res.data.token;
    localStorage.setItem('token', token);

    console.log("Saved token:", localStorage.getItem("token"));

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

// Signup
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
export const favoriteOfficialLocation = async (objectId) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(
    `${API_URL}/official-locations/${objectId}/favorite/`,
    {},
    { headers: { Authorization: `Token ${token}` } }
  );
  return res.data;
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

//User Create new location
export const createLocation = async (data) => {
  const token = localStorage.getItem("token");
  console.log("Using token:", token);

  try {
    const res = await axios.post(
      `${BASE_URL}/locations/create/`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Token ${token}` } : {}),
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("CreateLocation failed:", error.response?.data || error);
    throw error;
  }
};

//Update User made locations
export const editLocation = async (id, data, { method = "patch" } = {}) => {
  const token = localStorage.getItem("token");
  const url = `${BASE_URL}/locations/${id}/edit/`;

  const headers = {
    Authorization: `Token ${token}`,
    "Content-Type": "application/json",
  };

  if (method.toLowerCase() === "put") {
    const res = await axios.put(url, data, { headers });
    return res.data;
  } else {
    const res = await axios.patch(url, data, { headers });
    return res.data;
  }
};

//-- Fetch from DB Tables
// categories
export async function getCategories() {
  const res = await fetch(`${BASE_URL}/db/categories/`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}


// recreation types
export const getRecreationTypes = async () => {
  const response = await fetch(`${BASE_URL}/db/recreation-types/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch recreation types");
  return response.json();
};

// --- Gemini AI ---
const GEMINI_URL = "http://localhost:8000/api/ai_tools/generate/";

/**
 * Send a prompt and user input to Gemini
 * @param {string} prompt - the system prompt or preformatted text
 * @param {string} userMessage - the user's message
 * @returns {Promise<string>} - the generated response
 */
export const generateGeminiText = async (prompt, userMessage) => {
  try {
    const res = await axios.post(
      GEMINI_URL,
      { prompt, user_message: userMessage }, 
      { headers: getAuthHeaders() } 
    );
    return res.data.response; 
  } catch (error) {
    console.error("Gemini request failed:", error.response?.data || error.message);
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
