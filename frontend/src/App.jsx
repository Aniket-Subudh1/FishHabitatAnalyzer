import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import PredictionForm from './components/PredictionForm';
import ResultsDisplay from './components/ResultsDisplay';
import apiService from './services/api';
import './styles/index.css';

function App() {
  const [modelStatus, setModelStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [predictionMode, setPredictionMode] = useState('basic'); // 'basic' or 'advanced'
  const [predictionResult, setPredictionResult] = useState(null);
  const [parameterInfluence, setParameterInfluence] = useState(null);

  useEffect(() => {
    // Fetch model status on component mount
    const fetchModelStatus = async () => {
      try {
        setLoading(true);
        const status = await apiService.getModelStatus();
        setModelStatus(status);
        
        // Fetch parameter influence for the current prediction mode
        if (status[predictionMode]?.status === 'available') {
          const influence = predictionMode === 'basic' 
            ? await apiService.getBasicParameterInfluence()
            : await apiService.getAdvancedParameterInfluence();
          setParameterInfluence(influence);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching model status:', err);
        setError('Failed to connect to the server. Please make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchModelStatus();
  }, [predictionMode]);

  const handleModeChange = (mode) => {
    setPredictionMode(mode);
    setPredictionResult(null);
  };

  const handleTrainModel = async (modelType) => {
    try {
      setLoading(true);
      await apiService.trainModel(modelType);
      
      // Refresh model status after training
      const status = await apiService.getModelStatus();
      setModelStatus(status);
      
      // Fetch parameter influence
      if (modelType === predictionMode) {
        const influence = modelType === 'basic'
          ? await apiService.getBasicParameterInfluence()
          : await apiService.getAdvancedParameterInfluence();
        setParameterInfluence(influence);
      }
      
      setError(null);
    } catch (err) {
      console.error(`Error training ${modelType} model:`, err);
      setError(`Failed to train the ${modelType} model. Please check the server logs.`);
    } finally {
      setLoading(false);
    }
  };

  const handlePrediction = async (formData) => {
    try {
      setLoading(true);
      
      // Use the appropriate prediction endpoint based on the mode
      const result = predictionMode === 'basic'
        ? await apiService.predictBasic(formData)
        : await apiService.predictAdvanced(formData);
      
      setPredictionResult(result);
      setError(null);
    } catch (err) {
      console.error('Error making prediction:', err);
      setError('Failed to make prediction. Please check the server logs.');
      setPredictionResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Fish Habitat Analyzer</h1>
          <p className="mt-1">Water Quality & Species Prediction System</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
            <p>{error}</p>
          </div>
        )}

        <Dashboard 
          modelStatus={modelStatus} 
          onTrainModel={handleTrainModel}
          predictionMode={predictionMode}
          onModeChange={handleModeChange}
          loading={loading}
        />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <PredictionForm 
              mode={predictionMode} 
              onSubmit={handlePrediction}
              loading={loading}
              parameterInfluence={parameterInfluence}
            />
          </div>
          <div>
            {predictionResult && (
              <ResultsDisplay result={predictionResult} />
            )}
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center">Fish Habitat Analyzer © 2025</p>
        </div>
      </footer>
    </div>
  );
}

export default App;