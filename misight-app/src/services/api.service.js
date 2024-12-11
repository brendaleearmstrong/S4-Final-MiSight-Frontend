import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users`, {
      username: userData.username,
      password: userData.password,
      role: userData.role
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create user');
  }
};