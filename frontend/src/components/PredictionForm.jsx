import React, { useState, useEffect } from 'react';

const PredictionForm = ({ mode, onSubmit, loading, parameterInfluence }) => {
  // State for basic form
  const [basicForm, setBasicForm] = useState({
    ph: 7.2,
    temperature: 28.5,
    turbidity: 45.2,
  });

  // State for advanced form
  const [advancedForm, setAdvancedForm] = useState({
    temperature: 28.5,
    turbidity: 45.2,
    DO: 6.8,
    bod: 2.5,
    co2: 10.2,
    ph: 7.2,
    alkalinity: 120.0,
    hardness: 150.0,
    calcium: 40.0,
    ammonia: 0.05,
    nitrite: 0.01,
    phosphorus: 0.2,
    h2s: 0.002,
    plankton: 500.0,
  });

  // Reset form values when mode changes
  useEffect(() => {
    // Reset to defaults when mode changes
  }, [mode]);

  // Handle basic form changes
  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setBasicForm({
      ...basicForm,
      [name]: parseFloat(value),
    });
  };

  // Handle advanced form changes
  const handleAdvancedChange = (e) => {
    const { name, value } = e.target;
    setAdvancedForm({
      ...advancedForm,
      [name]: parseFloat(value),
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(mode === 'basic' ? basicForm : advancedForm);
  };

  // Helper function to render optimal range hint
  const getOptimalRangeHint = (param) => {
    if (!parameterInfluence || !parameterInfluence.optimal_ranges) return null;
    
    const range = parameterInfluence.optimal_ranges[param];
    if (!range) return null;
    
    return (
      <span className="text-xs text-gray-500 ml-1">
        (Optimal: {range[0]} - {range[1]})
      </span>
    );
  };

  // Helper function to get parameter importance
  const getImportance = (param) => {
    if (!parameterInfluence || !parameterInfluence.parameter_importance) return null;
    
    const importance = parameterInfluence.parameter_importance[param];
    if (importance === undefined) return null;
    
    // Calculate width based on importance (normalized)
    const width = Math.max(5, Math.min(100, importance * 100)); // Min 5%, max 100%
    
    return (
      <div className="mt-1 h-1 bg-gray-200 rounded">
        <div 
          className="h-1 bg-blue-500 rounded" 
          style={{ width: `${width}%` }}
          title={`Parameter importance: ${(importance * 100).toFixed(1)}%`}
        ></div>
      </div>
    );
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        {mode === 'basic' ? 'Basic Prediction' : 'Advanced Prediction'}
      </h2>

      <form onSubmit={handleSubmit}>
        {mode === 'basic' ? (
          // Basic form fields
          <>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ph">
                pH {getOptimalRangeHint('ph')}
              </label>
              <input
                id="ph"
                name="ph"
                type="number"
                step="0.1"
                min="0"
                max="14"
                value={basicForm.ph}
                onChange={handleBasicChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
              {getImportance('ph')}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="temperature">
                Temperature (°C) {getOptimalRangeHint('temperature')}
              </label>
              <input
                id="temperature"
                name="temperature"
                type="number"
                step="0.1"
                min="0"
                max="50"
                value={basicForm.temperature}
                onChange={handleBasicChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
              {getImportance('temperature')}
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="turbidity">
                Turbidity (cm) {getOptimalRangeHint('turbidity')}
              </label>
              <input
                id="turbidity"
                name="turbidity"
                type="number"
                step="0.1"
                min="0"
                max="200"
                value={basicForm.turbidity}
                onChange={handleBasicChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
              {getImportance('turbidity')}
            </div>
          </>
        ) : (
          // Advanced form fields
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ph">
                  pH {getOptimalRangeHint('ph')}
                </label>
                <input
                  id="ph"
                  name="ph"
                  type="number"
                  step="0.1"
                  min="0"
                  max="14"
                  value={advancedForm.ph}
                  onChange={handleAdvancedChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
                {getImportance('ph')}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="temperature">
                  Temperature (°C) {getOptimalRangeHint('temperature')}
                </label>
                <input
                  id="temperature"
                  name="temperature"
                  type="number"
                  step="0.1"
                  min="0"
                  max="50"
                  value={advancedForm.temperature}
                  onChange={handleAdvancedChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
                {getImportance('temperature')}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="turbidity">
                  Turbidity (cm) {getOptimalRangeHint('turbidity')}
                </label>
                <input
                  id="turbidity"
                  name="turbidity"
                  type="number"
                  step="0.1"
                  min="0"
                  max="200"
                  value={advancedForm.turbidity}
                  onChange={handleAdvancedChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
                {getImportance('turbidity')}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="DO">
                  Dissolved Oxygen (mg/L) {getOptimalRangeHint('dissolved_oxygen')}
                </label>
                <input
                  id="DO"
                  name="DO"
                  type="number"
                  step="0.1"
                  min="0"
                  max="20"
                  value={advancedForm.DO}
                  onChange={handleAdvancedChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
                {getImportance('dissolved_oxygen')}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bod">
                  BOD (mg/L) {getOptimalRangeHint('bod')}
                </label>
                <input
                  id="bod"
                  name="bod"
                  type="number"
                  step="0.1"
                  min="0"
                  max="20"
                  value={advancedForm.bod}
                  onChange={handleAdvancedChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
                {getImportance('bod')}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="co2">
                  CO2 (mg/L) {getOptimalRangeHint('co2')}
                </label>
                <input
                  id="co2"
                  name="co2"
                  type="number"
                  step="0.1"
                  min="0"
                  max="50"
                  value={advancedForm.co2}
                  onChange={handleAdvancedChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
                {getImportance('co2')}
              </div>

              {/* Add more advanced fields */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="alkalinity">
                  Alkalinity (mg/L) {getOptimalRangeHint('alkalinity')}
                </label>
                <input
                  id="alkalinity"
                  name="alkalinity"
                  type="number"
                  step="0.1"
                  min="0"
                  value={advancedForm.alkalinity}
                  onChange={handleAdvancedChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
                {getImportance('alkalinity')}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hardness">
                  Hardness (mg/L) {getOptimalRangeHint('hardness')}
                </label>
                <input
                  id="hardness"
                  name="hardness"
                  type="number"
                  step="0.1"
                  min="0"
                  value={advancedForm.hardness}
                  onChange={handleAdvancedChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
                {getImportance('hardness')}
              </div>

              {/* More advanced fields in abbreviated form */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ammonia">
                  Ammonia (mg/L)
                </label>
                <input
                  id="ammonia"
                  name="ammonia"
                  type="number"
                  step="0.001"
                  min="0"
                  value={advancedForm.ammonia}
                  onChange={handleAdvancedChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nitrite">
                  Nitrite (mg/L)
                </label>
                <input
                  id="nitrite"
                  name="nitrite"
                  type="number"
                  step="0.001"
                  min="0"
                  value={advancedForm.nitrite}
                  onChange={handleAdvancedChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
            </div>
          </>
        )}

        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? 'Predicting...' : 'Make Prediction'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PredictionForm;