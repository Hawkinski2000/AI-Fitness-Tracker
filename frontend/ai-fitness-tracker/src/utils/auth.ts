import axios from 'axios';
import { API_BASE_URL } from "../config/api";


export const logIn = async (emailString: string, passwordString: string) => {
    try {
      const formData = new FormData();
      formData.append('username', emailString);
      formData.append('password', passwordString);

      const response = await axios.post(
        `${API_BASE_URL}/tokens`,
        formData,
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
