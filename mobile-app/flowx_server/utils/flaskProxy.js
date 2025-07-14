import axios from 'axios';

const flaskBaseUrl = process.env.FLASK_API_URL || 'http://127.0.0.1:5000';
console.log(`🐍 Flask base URL set to: ${flaskBaseUrl}`);

export const callFlaskModel = async (modelName, features) => {
  const url = `${flaskBaseUrl}/predict/${modelName}`;
  console.log(`📡 Calling Flask model at: ${url}`);
  console.log(`📊 Sending features:`, features);
  
  try {
    const response = await axios.post(url, { features });
    console.log(`✅ Received response from model`);
    console.debug('Model response:', response.data);
    return response.data;
  } catch (error) {
    console.error('‼️ Model call failed:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received');
    } else {
      console.error('Error:', error.message);
    }
    throw error;
  }
};