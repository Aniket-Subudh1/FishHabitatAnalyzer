import React, { useState } from 'react';

const FishSpeciesInfo = ({ species }) => {
  const [expanded, setExpanded] = useState(false);

  // If no species data is provided
  if (!species) return null;

  const { 
    name, 
    scientific_name, 
    ideal_ph_range, 
    ideal_temperature_range, 
    ideal_turbidity_range,
    description 
  } = species;

  return (
    <div className="border rounded-lg overflow-hidden">
      <div 
        className="bg-gray-50 p-4 flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <h4 className="font-bold text-gray-800">{name}</h4>
          {scientific_name && (
            <p className="text-sm text-gray-600 italic">{scientific_name}</p>
          )}
        </div>
        <button className="text-gray-500">
          {expanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
      
      {expanded && (
        <div className="p-4 bg-white">
          {description && (
            <p className="text-sm text-gray-700 mb-4">{description}</p>
          )}
          
          <h5 className="font-medium text-sm text-gray-700 mb-2">Optimal Water Parameters:</h5>
          <div className="grid grid-cols-3 gap-2 text-sm">
            {ideal_ph_range && (
              <div>
                <span className="text-gray-600 block">pH Range:</span>
                <span className="font-medium">{ideal_ph_range[0]} - {ideal_ph_range[1]}</span>
              </div>
            )}
            
            {ideal_temperature_range && (
              <div>
                <span className="text-gray-600 block">Temperature:</span>
                <span className="font-medium">{ideal_temperature_range[0]} - {ideal_temperature_range[1]} °C</span>
              </div>
            )}
            
            {ideal_turbidity_range && (
              <div>
                <span className="text-gray-600 block">Turbidity:</span>
                <span className="font-medium">{ideal_turbidity_range[0]} - {ideal_turbidity_range[1]} cm</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FishSpeciesInfo;