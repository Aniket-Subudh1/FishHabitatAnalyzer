import axios from 'axios';


const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';


const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


const getFallbackPrediction = (data) => {
  return {
    predicted_species: 'Tilapia (Fallback)',
    confidence: 0.7,
    water_quality_score: 5.0,
    parameter_analysis: {
      ph: { 
        value: data.ph, 
        status: 'unknown', 
        recommendation: null 
      },
      temperature: { 
        value: data.temperature, 
        status: 'unknown', 
        recommendation: null 
      },
      turbidity: { 
        value: data.turbidity, 
        status: 'unknown', 
        recommendation: null 
      }
    },
    suitable_species: [{
      name: 'Tilapia',
      scientific_name: 'Oreochromis niloticus',
      ideal_ph_range: [6.5, 8.0],
      ideal_temperature_range: [25.0, 30.0],
      ideal_turbidity_range: [30.0, 80.0],
      description: 'Tilapia is a hardy fish that can tolerate a wide range of water conditions (fallback data).'
    }]
  };
};


const apiService = {
 
  getModelStatus: async () => {
    try {
      const response = await apiClient.get('/models/status');
      return response.data;
    } catch (error) {
      console.error('Error getting model status:', error);
      return {
        basic: { status: 'unknown', info: {} },
        advanced: { status: 'unknown', info: {} },
        water_quality: { status: 'unknown', info: {} }
      };
    }
  },


  trainModel: async (modelType, testSize = 0.2, randomState = 42) => {
    try {
      const response = await apiClient.post('/train', {
        model_type: modelType,
        test_size: testSize,
        random_state: randomState,
      });
      return response.data;
    } catch (error) {
      console.error(`Error training ${modelType} model:`, error);
      throw error; 
    }
  },

 
  predictBasic: async (data) => {
    try {
      const response = await apiClient.post('/predict/basic', data);
      return response.data;
    } catch (error) {
      console.error('Error making basic prediction:', error);
      return getFallbackPrediction(data);
    }
  },

  predictAdvanced: async (data) => {
    try {
      const response = await apiClient.post('/predict/advanced', data);
      return response.data;
    } catch (error) {
      console.error('Error making advanced prediction:', error);
      return getFallbackPrediction(data);
    }
  },

 
  predictWaterQuality: async (data) => {
    try {
      const response = await apiClient.post('/water-quality', data);
      return response.data;
    } catch (error) {
      console.error('Error predicting water quality:', error);
   
      return 5.0;
    }
  },


  getBasicParameterInfluence: async () => {
    try {
      const response = await apiClient.get('/parameters/basic/influence');
      return response.data;
    } catch (error) {
      console.error('Error getting basic parameter influence:', error);
      return {
        parameter_importance: {
          ph: 0.3,
          temperature: 0.4,
          turbidity: 0.3
        },
        optimal_ranges: {
          ph: [6.5, 8.5],
          temperature: [22.0, 30.0],
          turbidity: [30.0, 80.0]
        }
      };
    }
  },

  getAdvancedParameterInfluence: async () => {
    try {
      const response = await apiClient.get('/parameters/advanced/influence');
      return response.data;
    } catch (error) {
      console.error('Error getting advanced parameter influence:', error);
      return {
        parameter_importance: {
          ph: 0.2,
          temperature: 0.2,
          turbidity: 0.1,
          dissolved_oxygen: 0.2,
          bod: 0.05,
          co2: 0.05,
          alkalinity: 0.05,
          hardness: 0.05,
          calcium: 0.03,
          ammonia: 0.05,
          nitrite: 0.03,
          phosphorus: 0.03,
          h2s: 0.02,
          plankton: 0.02
        },
        optimal_ranges: {
          ph: [6.5, 8.5],
          temperature: [22.0, 30.0],
          turbidity: [30.0, 80.0],
          dissolved_oxygen: [5.0, 9.0],
          bod: [0.0, 3.0],
          co2: [5.0, 15.0],
          alkalinity: [100.0, 180.0],
          hardness: [120.0, 200.0],
          calcium: [30.0, 60.0],
          ammonia: [0.0, 0.1],
          nitrite: [0.0, 0.05],
          phosphorus: [0.0, 0.5],
          h2s: [0.0, 0.01],
          plankton: [300.0, 800.0]
        }
      };
    }
  },
};

export default apiService;