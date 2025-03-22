import React from 'react';
import WaterQualityChart from './WaterQualityChart';

const Dashboard = ({ 
  modelStatus, 
  onTrainModel, 
  predictionMode, 
  onModeChange, 
  loading 
}) => {
  // Helper function to get status badge
  const getStatusBadge = (status) => {
    if (status === 'available') {
      return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Available</span>;
    } else {
      return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Not Trained</span>;
    }
  };

  // Helper function to format model accuracy
  const getModelAccuracy = (model) => {
    if (model?.status === 'available' && model?.info?.accuracy) {
      return `${(model.info.accuracy * 100).toFixed(1)}%`;
    }
    return 'N/A';
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">System Dashboard</h2>
        <div className="space-x-2">
          <button
            onClick={() => onModeChange('basic')}
            className={`px-4 py-2 rounded ${
              predictionMode === 'basic'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            disabled={loading}
          >
            Basic Mode
          </button>
          <button
            onClick={() => onModeChange('advanced')}
            className={`px-4 py-2 rounded ${
              predictionMode === 'advanced'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            disabled={loading}
          >
            Advanced Mode
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Basic Model Status */}
        <div className="bg-gray-50 p-4 rounded border">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Basic Model</h3>
            {getStatusBadge(modelStatus.basic?.status || 'not_trained')}
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Accuracy: {getModelAccuracy(modelStatus.basic)}
          </p>
          <button
            onClick={() => onTrainModel('basic')}
            className="w-full mt-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
            disabled={loading}
          >
            {loading && predictionMode === 'basic' ? 'Training...' : 'Train Model'}
          </button>
        </div>

        {/* Advanced Model Status */}
        <div className="bg-gray-50 p-4 rounded border">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Advanced Model</h3>
            {getStatusBadge(modelStatus.advanced?.status || 'not_trained')}
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Accuracy: {getModelAccuracy(modelStatus.advanced)}
          </p>
          <button
            onClick={() => onTrainModel('advanced')}
            className="w-full mt-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
            disabled={loading}
          >
            {loading && predictionMode === 'advanced' ? 'Training...' : 'Train Model'}
          </button>
        </div>

        {/* Water Quality Model Status */}
        <div className="bg-gray-50 p-4 rounded border">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Water Quality Model</h3>
            {getStatusBadge(modelStatus.water_quality?.status || 'not_trained')}
          </div>
          <p className="text-sm text-gray-600 mb-2">
            R² Score: {
              modelStatus.water_quality?.status === 'available' && modelStatus.water_quality?.info?.r2_score
                ? modelStatus.water_quality.info.r2_score.toFixed(3)
                : 'N/A'
            }
          </p>
          <button
            onClick={() => onTrainModel('water_quality')}
            className="w-full mt-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
            disabled={loading}
          >
            {loading ? 'Training...' : 'Train Model'}
          </button>
        </div>
      </div>

      {/* Sample water quality visualization */}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Parameter Influence on Fish Species</h3>
        <WaterQualityChart predictionMode={predictionMode} />
      </div>
    </div>
  );
};

export default Dashboard;