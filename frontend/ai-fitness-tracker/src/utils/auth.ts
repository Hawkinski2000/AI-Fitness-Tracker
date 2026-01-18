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
    
    return response;

  } catch (error) {
    console.error('logIn failed:', error);
    throw error;
  }
};

export const logInWithGoogle = async (accessToken: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/tokens/google`,
      { access_token: accessToken },
      { withCredentials: true }
    );

    console.log('logInWithGoogle successful.');
    
    return response;

  } catch (error) {
    console.error('logInWithGoogle failed:', error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await axios.post(`${API_BASE_URL}/tokens/revoke`, {}, { withCredentials: true });

  } catch (err) {
    console.error("Failed to revoke access token", err);
  }
};

export const refreshAccessToken = async () => {
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

interface JwtPayload {
  user_id: number;
  exp: number;
}

export const getUserFromToken = async (token: string) => {
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

export const isTokenExpired = (token: string) => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);

    const now = Date.now() / 1000;
    return decoded.exp < now;

  } catch (err) {
    console.error("Failed to decode token", err);
    return true;
  }
};
