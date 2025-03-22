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
  const [predictionMode, setPredictionMode] = useState('basic'); 
  const [predictionResult, setPredictionResult] = useState(null);
  const [parameterInfluence, setParameterInfluence] = useState(null);
  const [currentFormValues, setCurrentFormValues] = useState(null);

  useEffect(() => {
    const fetchModelStatus = async () => {
      try {
        setLoading(true);
        const status = await apiService.getModelStatus();
        setModelStatus(status);
        
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
    setCurrentFormValues(null);
  };

  const handleTrainModel = async (modelType) => {
    try {
      setLoading(true);
      await apiService.trainModel(modelType);
      
      const status = await apiService.getModelStatus();
      setModelStatus(status);
      
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

  const handleFormValueChange = (values) => {
    setCurrentFormValues(values);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Fish Habitat Analyzer</h1>
              <p className="mt-1 text-indigo-100">Water Quality & Species Prediction System</p>
            </div>
            <div className="hidden sm:block">
              <img src="/logo192.png" alt="Logo" className="h-14 w-14" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm" role="alert">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p>{error}</p>
            </div>
          </div>
        )}

        <Dashboard 
          modelStatus={modelStatus} 
          onTrainModel={handleTrainModel}
          predictionMode={predictionMode}
          onModeChange={handleModeChange}
          loading={loading}
          parameterInfluence={parameterInfluence}
          predictionResult={predictionResult}
          currentFormValues={currentFormValues}
        />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <PredictionForm 
              mode={predictionMode} 
              onSubmit={handlePrediction}
              loading={loading}
              parameterInfluence={parameterInfluence}
              onFormChange={handleFormValueChange}
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
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-center mb-2 md:mb-0">Fish Habitat Analyzer © 2025</p>
            <div className="flex space-x-4">
              <a href="#help" className="text-gray-300 hover:text-white">Help</a>
              <a href="#about" className="text-gray-300 hover:text-white">About</a>
              <a href="#contact" className="text-gray-300 hover:text-white">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;