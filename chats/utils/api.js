import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Replace with your actual local IP address or backend URL
const API_URL = 'http://10.185.199.89:5000/api';

// Create Axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Automatically attach token to all requests
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// REGISTER user
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    console.log('Registration successful:', response.data);

    if (response.data.token) {
      await SecureStore.setItemAsync('userToken', response.data.token);
    }

    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    throw error;
  }
};

// LOGIN user
export const login = async (userData) => {
  try {
    const response = await api.post('/auth/login', userData);
    console.log('Login successful:', response.data);

    if (response.data.token) {
      await SecureStore.setItemAsync('userToken', response.data.token);
    }

    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};

// GET all users
export const getAllUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('Get users error:', error.response?.data || error.message);
    throw error;
  }
};

export const getChatHistory = async (recipientId) => {
  try {
    // The URL was incorrect. It should be '/messages/history/...'
    const response = await api.get(`/messages/history/${recipientId}`);
    return response.data;
  } catch (error) {
    console.error('Get chat history error:', error.response.data);
    throw error;
  }
};
// GET my profile (authenticated)
export const getMyProfile = async () => {
  try {
    const response = await api.get('/users/profile');
    return response.data;
  } catch (error) {
    console.error('Get profile error:', error.response?.data || error.message);
    throw error;
  }
};

// UPDATE my profile with optional image
export const updateProfile = async (profileData) => {
  try {
    const formData = new FormData();

    formData.append('username', profileData.username);
    formData.append('email', profileData.email);

    if (profileData.profileImage) {
      const uriParts = profileData.profileImage.split('.');
      const fileType = uriParts[uriParts.length - 1].toLowerCase();

      // Ensure the URI has file:// prefix (especially on Android)
      let uri = profileData.profileImage;
      if (!uri.startsWith('file://') && !uri.startsWith('content://')) {
        uri = 'file://' + uri;
      }

      formData.append('profilePicture', {
        uri,
        name: `photo.${fileType}`,
        type: `image/${fileType === 'jpg' ? 'jpeg' : fileType}`,
      });
    }

    // Debug: log formData keys
    if (formData._parts) {
      formData._parts.forEach(([key, value]) => {
        console.log('FormData:', key, value);
      });
    }

    const response = await api.put('/users/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Update profile error:', error.response?.data || error.message);
    throw error;
  }
};
