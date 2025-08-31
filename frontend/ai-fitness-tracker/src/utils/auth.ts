import axios from 'axios';


export const logIn = async (emailString: string, passwordString: string) => {
    try {
      const formData = new FormData();
      formData.append('username', emailString);
      formData.append('password', passwordString);

      const response = await axios.post(
        'http://172.24.192.1:8000/api/tokens',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
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
