import React from 'react';
import WaterQualityChart from './WaterQualityChart';

const Dashboard = ({ 
  modelStatus, 
  onTrainModel, 
  predictionMode, 
  onModeChange, 
  loading,
  parameterInfluence,
  predictionResult,
  currentFormValues  
}) => {
  const getStatusBadge = (status) => {
    if (status === 'available') {
      return <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-800 font-medium">Available</span>;
    } else if (status === 'error') {
      return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 font-medium">Error</span>;
    } else {
      return <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800 font-medium">Not Trained</span>;
    }
  };

  const getModelAccuracy = (model) => {
    if (model?.status === 'available' && model?.info?.accuracy) {
      return `${(model.info.accuracy * 100).toFixed(1)}%`;
    }
    return 'N/A';
  };
  
  const getR2Score = (model) => {
    if (model?.status === 'available' && model?.info?.r2_score) {
      return model.info.r2_score.toFixed(3);
    }
    return 'N/A';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <h2 className="text-xl font-bold text-gray-800">System Dashboard</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => onModeChange('basic')}
                className={`px-4 py-2 rounded-md shadow-sm font-medium text-sm transition-colors ${
                  predictionMode === 'basic'
                    ? 'bg-indigo-600 text-white shadow-indigo-100'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
                disabled={loading}
              >
                Basic Mode
              </button>
              <button
                onClick={() => onModeChange('advanced')}
                className={`px-4 py-2 rounded-md shadow-sm font-medium text-sm transition-colors ${
                  predictionMode === 'advanced'
                    ? 'bg-indigo-600 text-white shadow-indigo-100'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
                disabled={loading}
              >
                Advanced Mode
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          <div className="p-5">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-800">Basic Model</h3>
                <p className="text-xs text-gray-500 mt-1">Simple prediction model</p>
              </div>
              {getStatusBadge(modelStatus.basic?.status || 'not_trained')}
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Accuracy</span>
                <span className="text-sm font-semibold">{getModelAccuracy(modelStatus.basic)}</span>
              </div>
              
              {modelStatus.basic?.info?.f1_score && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">F1 Score</span>
                  <span className="text-sm font-semibold">{modelStatus.basic.info.f1_score.toFixed(3)}</span>
                </div>
              )}
            </div>
            
            <button
              onClick={() => onTrainModel('basic')}
              className="w-full mt-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 shadow-sm disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
              disabled={loading}
            >
              {loading && predictionMode === 'basic' ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Training...
                </span>
              ) : (
                'Train Model'
              )}
            </button>
          </div>

          <div className="p-5">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-800">Advanced Model</h3>
                <p className="text-xs text-gray-500 mt-1">Comprehensive prediction model</p>
              </div>
              {getStatusBadge(modelStatus.advanced?.status || 'not_trained')}
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Accuracy</span>
                <span className="text-sm font-semibold">{getModelAccuracy(modelStatus.advanced)}</span>
              </div>
              
              {modelStatus.advanced?.info?.f1_score && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">F1 Score</span>
                  <span className="text-sm font-semibold">{modelStatus.advanced.info.f1_score.toFixed(3)}</span>
                </div>
              )}
            </div>
            
            <button
              onClick={() => onTrainModel('advanced')}
              className="w-full mt-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 shadow-sm disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
              disabled={loading}
            >
              {loading && predictionMode === 'advanced' ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Training...
                </span>
              ) : (
                'Train Model'
              )}
            </button>
          </div>

          <div className="p-5">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-800">Water Quality Model</h3>
                <p className="text-xs text-gray-500 mt-1">Water quality scoring model</p>
              </div>
              {getStatusBadge(modelStatus.water_quality?.status || 'not_trained')}
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">R² Score</span>
                <span className="text-sm font-semibold">{getR2Score(modelStatus.water_quality)}</span>
              </div>
              
              {modelStatus.water_quality?.info?.mse && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">MSE</span>
                  <span className="text-sm font-semibold">{modelStatus.water_quality.info.mse.toFixed(4)}</span>
                </div>
              )}
            </div>
            
            <button
              onClick={() => onTrainModel('water_quality')}
              className="w-full mt-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 shadow-sm disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Training...
                </span>
              ) : (
                'Train Model'
              )}
            </button>
          </div>
        </div>
      </div>

     
      <div className="mt-6">
        <WaterQualityChart 
          predictionMode={predictionMode} 
          parameterInfluence={parameterInfluence}
          predictionResult={predictionResult}
          currentFormValues={currentFormValues}  
        />
      </div>
    </div>
  );
};

export default Dashboard;