import { mainApi } from './api';
import { Platform } from 'react-native';

// Login
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await mainApi.post('/login', { email, password });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

// Register
export const registerUser = async (userData: any) => {
  try {
    const response = await mainApi.post('/signup', userData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

// Request password reset
export const requestPasswordReset = async (email: string) => {
  try {
    const response = await mainApi.post('/forgot-password', { email });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to request password reset'
    );
  }
};

// Get user profile
export const getProfile = async (token: string) => {
  try {
    const response = await mainApi.get('/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get profile');
  }
};

// Update profile
export const updateProfile = async (token: string, userData: any) => {
  try {
    const response = await mainApi.put('/profile', userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to update profile'
    );
  }
};

// Upload profile image
// Upload profile image
export const uploadProfileImage = async (token: string, formData: FormData) => {
  try {
    const response = await mainApi.post('/profile/upload', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error uploading profile image:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
    throw new Error(error.response?.data?.message || error.message);
  }
};
// Logout
export const logoutUser = async (token: string) => {
  try {
    const response = await mainApi.post(
      '/logout',
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Logout failed');
  }
};
