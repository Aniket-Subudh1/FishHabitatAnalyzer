import axios from 'axios';


const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';


const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


const apiService = {
 
  getModelStatus: async () => {
    const response = await apiClient.get('/models/status');
    return response.data;
  },

  trainModel: async (modelType, testSize = 0.2, randomState = 42) => {
    const response = await apiClient.post('/train', {
      model_type: modelType,
      test_size: testSize,
      random_state: randomState,
    });
    return response.data;
 
  },


  predictBasic: async (data) => {
    const response = await apiClient.post('/predict/basic', data);
    return response.data;
  },

  predictAdvanced: async (data) => {
    const response = await apiClient.post('/predict/advanced', data);
    return response.data;
  },


  predictWaterQuality: async (data) => {
    const response = await apiClient.post('/water-quality', data);
    return response.data;
  },


  getBasicParameterInfluence: async () => {
    const response = await apiClient.get('/parameters/basic/influence');
    return response.data;
  },

  getAdvancedParameterInfluence: async () => {
    const response = await apiClient.get('/parameters/advanced/influence');
    return response.data;
  },
};

export default apiService;