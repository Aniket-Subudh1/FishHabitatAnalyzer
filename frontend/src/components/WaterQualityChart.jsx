import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const WaterQualityChart = ({ predictionMode }) => {

  const sampleBasicData = [
    { name: 'pH', optimal: [6.5, 8.5], current: 7.2 },
    { name: 'Temperature', optimal: [22, 30], current: 28.5 },
    { name: 'Turbidity', optimal: [30, 80], current: 45.2 },
  ];

  const sampleAdvancedData = [
    { name: 'pH', optimal: [6.5, 8.5], current: 7.2 },
    { name: 'Temp', optimal: [22, 30], current: 28.5 },
    { name: 'DO', optimal: [5, 9], current: 6.8 },
    { name: 'CO2', optimal: [5, 15], current: 10.2 },
    { name: 'Ammonia', optimal: [0, 0.1], current: 0.05 },
  ];


  const data = predictionMode === 'basic' ? sampleBasicData : sampleAdvancedData;


  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border shadow-sm">
          <p className="font-bold">{label}</p>
          <p className="text-sm">
            Current: <span className="font-medium">{payload[0].value}</span>
          </p>
          <p className="text-sm">
            Optimal Range: <span className="font-medium">{payload[0].payload.optimal[0]} - {payload[0].payload.optimal[1]}</span>
          </p>
        </div>
      );
    }
    return null;
  };


  const formatYAxis = (value) => {
 
    return value;
  };

  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3 className="text-lg font-medium mb-4">Water Parameter Comparison</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={formatYAxis} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="current" fill="#3B82F6" name="Current Value" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <p className="text-sm text-gray-600 mt-2">
        This chart shows how current water parameters compare to optimal ranges for fish habitat.
      </p>
    </div>
  );
};

export default WaterQualityChart;