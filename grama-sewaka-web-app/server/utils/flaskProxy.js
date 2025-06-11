import axios from 'axios';

const flaskBaseUrl = process.env.FLASK_API_URL || 'http://127.0.0.1:5000';

export const callFlaskModel = async (modelName, features) => {
  const url = `${flaskBaseUrl}/predict/${modelName}`;
  try {
    const response = await axios.post(url, { features });
    return response;
  } catch (error) {
    //forward error details for better debugging
    if (error.response) {
      throw new Error(error.response.data?.error || error.response.statusText);
    }
    throw error;
  }
};
