import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { API_BASE_URL } from "../config/api";


export const logIn = async (emailString: string, passwordString: string) => {
    try {
      const formData = new FormData();
      formData.append('username', emailString);
      formData.append('password', passwordString);

      const response = await axios.post(`${API_BASE_URL}/tokens`, formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true
        }
      );

      console.log('logIn successful.');
      const token = response.data.access_token;
      return token;

    } catch (error) {
      console.error('logIn failed:', error);
      throw error;
    }
  };

export const refreshAccessToken = async (accessToken: string | null) => {
  if (accessToken) {
    return accessToken;
  }

  try {
    const refreshResponse = await axios.post(`${API_BASE_URL}/tokens/refresh`, {}, { withCredentials: true });
    const newToken = refreshResponse.data.access_token;
    if (newToken) {
      return newToken;
    }

  } catch (err) {
    console.error("Failed to refresh access token", err);
  }
};

export const getUserFromToken = async (token: string) => {
  interface JwtPayload {
    user_id: number;
  }

  const decoded = jwtDecode<JwtPayload>(token);
  const userId = decoded.user_id;

  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;

  } catch (err) {
    console.error("Could not load user data", err);
  }
};
