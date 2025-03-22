import React from 'react';
import FishSpeciesInfo from './FishSpeciesInfo';

const ResultsDisplay = ({ result }) => {
  if (!result) return null;

  const { predicted_species, confidence, water_quality_score, parameter_analysis, suitable_species } = result;

  // Helper function to render parameter status
  const getStatusBadge = (status) => {
    if (status === 'optimal') {
      return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Optimal</span>;
    } else {
      return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Suboptimal</span>;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Prediction Results</h2>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Predicted Fish Species</h3>
          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {(confidence * 100).toFixed(1)}% Confidence
          </span>
        </div>
        <div className="p-4 border rounded-lg bg-blue-50">
          <div className="text-2xl font-bold text-center text-blue-800">{predicted_species}</div>
        </div>
      </div>

      {water_quality_score && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Water Quality Score</h3>
          <div className="flex items-center">
            <div 
              className="h-4 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full flex-grow"
            ></div>
            <div 
              className="h-6 w-6 rounded-full bg-white border-2 border-gray-700 -ml-3"
              style={{ marginLeft: `calc(${Math.min(Math.max(water_quality_score / 10, 0), 1) * 100}% - 12px)` }}
            ></div>
            <span className="ml-2 font-bold">{water_quality_score.toFixed(1)}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>Poor</span>
            <span>Excellent</span>
          </div>
        </div>
      )}

      {parameter_analysis && Object.keys(parameter_analysis).length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Parameter Analysis</h3>
          <div className="overflow-hidden border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Parameter</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(parameter_analysis).map(([param, details]) => (
                  <tr key={param}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{param}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{details.value}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {getStatusBadge(details.status)}
                      {details.recommendation && (
                        <p className="text-xs text-gray-500 mt-1">{details.recommendation}</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {suitable_species && suitable_species.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Other Suitable Species</h3>
          <div className="space-y-4">
            {suitable_species
              .filter(species => species.name !== predicted_species)
              .slice(0, 3)  // Limit to 3 additional species
              .map((species, index) => (
                <FishSpeciesInfo key={index} species={species} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;