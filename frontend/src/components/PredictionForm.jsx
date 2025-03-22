import React, { useState, useEffect } from 'react';

const PredictionForm = ({ mode, onSubmit, loading, parameterInfluence, onFormChange }) => {
  const [basicForm, setBasicForm] = useState({
    ph: 7.2,
    temperature: 28.5,
    turbidity: 45.2,
  });

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

  useEffect(() => {
    if (onFormChange) {
      onFormChange(mode === 'basic' ? basicForm : advancedForm);
    }
  }, [basicForm, advancedForm, mode, onFormChange]);

  useEffect(() => {
    if (onFormChange) {
      onFormChange(mode === 'basic' ? basicForm : advancedForm);
    }
  }, [mode]);

  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setBasicForm({
      ...basicForm,
      [name]: parseFloat(value),
    });
  };

  const handleAdvancedChange = (e) => {
    const { name, value } = e.target;
    setAdvancedForm({
      ...advancedForm,
      [name]: parseFloat(value),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(mode === 'basic' ? basicForm : advancedForm);
  };

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

  const getImportance = (param) => {
    if (!parameterInfluence || !parameterInfluence.parameter_importance) return null;
    
    const importance = parameterInfluence.parameter_importance[param];
    if (importance === undefined) return null;
    
    const width = Math.max(5, Math.min(100, importance * 100)); 
    
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

  const isInOptimalRange = (param, value) => {
    if (!parameterInfluence || !parameterInfluence.optimal_ranges) return true;
    
    const range = parameterInfluence.optimal_ranges[param];
    if (!range) return true;
    
    return value >= range[0] && value <= range[1];
  };

  const getInputBorderClass = (param, value) => {
    if (!parameterInfluence || !parameterInfluence.optimal_ranges) return "";
    
    return isInOptimalRange(param, value) 
      ? "border-green-300 focus:border-green-500 focus:ring-green-500" 
      : "border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500";
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        {mode === 'basic' ? 'Basic Prediction' : 'Advanced Prediction'}
      </h2>

      <form onSubmit={handleSubmit}>
        {mode === 'basic' ? (
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
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${getInputBorderClass('ph', basicForm.ph)}`}
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
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${getInputBorderClass('temperature', basicForm.temperature)}`}
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
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${getInputBorderClass('turbidity', basicForm.turbidity)}`}
                required
              />
              {getImportance('turbidity')}
            </div>
          </>
        ) : (
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
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${getInputBorderClass('ph', advancedForm.ph)}`}
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
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${getInputBorderClass('temperature', advancedForm.temperature)}`}
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
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${getInputBorderClass('turbidity', advancedForm.turbidity)}`}
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
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${getInputBorderClass('dissolved_oxygen', advancedForm.DO)}`}
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
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${getInputBorderClass('bod', advancedForm.bod)}`}
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
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${getInputBorderClass('co2', advancedForm.co2)}`}
                  required
                />
                {getImportance('co2')}
              </div>

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
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${getInputBorderClass('alkalinity', advancedForm.alkalinity)}`}
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
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${getInputBorderClass('hardness', advancedForm.hardness)}`}
                  required
                />
                {getImportance('hardness')}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="calcium">
                  Calcium (mg/L) {getOptimalRangeHint('calcium')}
                </label>
                <input
                  id="calcium"
                  name="calcium"
                  type="number"
                  step="0.1"
                  min="0"
                  value={advancedForm.calcium}
                  onChange={handleAdvancedChange}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${getInputBorderClass('calcium', advancedForm.calcium)}`}
                  required
                />
                {getImportance('calcium')}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ammonia">
                  Ammonia (mg/L) {getOptimalRangeHint('ammonia')}
                </label>
                <input
                  id="ammonia"
                  name="ammonia"
                  type="number"
                  step="0.001"
                  min="0"
                  value={advancedForm.ammonia}
                  onChange={handleAdvancedChange}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${getInputBorderClass('ammonia', advancedForm.ammonia)}`}
                  required
                />
                {getImportance('ammonia')}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nitrite">
                  Nitrite (mg/L) {getOptimalRangeHint('nitrite')}
                </label>
                <input
                  id="nitrite"
                  name="nitrite"
                  type="number"
                  step="0.001"
                  min="0"
                  value={advancedForm.nitrite}
                  onChange={handleAdvancedChange}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${getInputBorderClass('nitrite', advancedForm.nitrite)}`}
                  required
                />
                {getImportance('nitrite')}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phosphorus">
                  Phosphorus (mg/L) {getOptimalRangeHint('phosphorus')}
                </label>
                <input
                  id="phosphorus"
                  name="phosphorus"
                  type="number"
                  step="0.001"
                  min="0"
                  value={advancedForm.phosphorus}
                  onChange={handleAdvancedChange}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${getInputBorderClass('phosphorus', advancedForm.phosphorus)}`}
                  required
                />
                {getImportance('phosphorus')}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="h2s">
                  H₂S (mg/L) {getOptimalRangeHint('h2s')}
                </label>
                <input
                  id="h2s"
                  name="h2s"
                  type="number"
                  step="0.001"
                  min="0"
                  value={advancedForm.h2s}
                  onChange={handleAdvancedChange}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${getInputBorderClass('h2s', advancedForm.h2s)}`}
                  required
                />
                {getImportance('h2s')}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="plankton">
                  Plankton (No. L⁻¹) {getOptimalRangeHint('plankton')}
                </label>
                <input
                  id="plankton"
                  name="plankton"
                  type="number"
                  step="1"
                  min="0"
                  value={advancedForm.plankton}
                  onChange={handleAdvancedChange}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${getInputBorderClass('plankton', advancedForm.plankton)}`}
                  required
                />
                {getImportance('plankton')}
              </div>
            </div>
          </>
        )}

        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-indigo-300"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Predicting...
              </span>
            ) : (
              'Make Prediction'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PredictionForm;