"use client"

import { Droplets, Fish, Gauge } from "lucide-react"
import FishSpeciesInfo from "./FishSpeciesInfo"

const ResultsDisplay = ({ result }) => {
  if (!result) return null

  const { predicted_species, confidence, water_quality_score, parameter_analysis, suitable_species } = result

  // Helper function to render parameter status
  const getStatusBadge = (status) => {
    if (status === "optimal") {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-emerald-100/80 text-emerald-800 font-medium">Optimal</span>
      )
    } else {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-amber-100/80 text-amber-800 font-medium">Suboptimal</span>
      )
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-6 border border-slate-200/50">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
        <Fish className="mr-2 h-5 w-5 text-cyan-600" />
        Prediction Results
      </h2>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-slate-700">Predicted Fish Species</h3>
          <span className="text-sm bg-cyan-100/80 text-cyan-800 px-3 py-1 rounded-full font-medium">
            {(confidence * 100).toFixed(1)}% Confidence
          </span>
        </div>
        <div className="p-6 border border-cyan-100 rounded-xl bg-gradient-to-r from-cyan-50/80 to-blue-50/80 shadow-sm">
          <div className="text-2xl font-bold text-center text-cyan-700">{predicted_species}</div>
        </div>
      </div>

      {water_quality_score && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3 text-slate-700 flex items-center">
            <Droplets className="mr-2 h-5 w-5 text-cyan-600" />
            Water Quality Score
          </h3>
          <div className="p-4 border border-slate-200/50 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
            <div className="flex items-center mb-2">
              <div className="h-4 bg-gradient-to-r from-red-400 via-amber-400 to-emerald-400 rounded-full flex-grow"></div>
              <div
                className="h-7 w-7 rounded-full bg-white border-2 border-cyan-600 shadow-md -ml-3 flex items-center justify-center text-xs font-bold text-cyan-700"
                style={{ marginLeft: `calc(${Math.min(Math.max(water_quality_score / 10, 0), 1) * 100}% - 14px)` }}
              >
                {water_quality_score.toFixed(1)}
              </div>
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-1 px-1">
              <span>Poor</span>
              <span>Excellent</span>
            </div>
          </div>
        </div>
      )}

      {parameter_analysis && Object.keys(parameter_analysis).length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3 text-slate-700 flex items-center">
            <Gauge className="mr-2 h-5 w-5 text-cyan-600" />
            Parameter Analysis
          </h3>
          <div className="overflow-hidden border border-slate-200/50 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
            <table className="min-w-full divide-y divide-slate-200/70">
              <thead className="bg-gradient-to-r from-cyan-50/80 to-blue-50/80">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Parameter
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/30 divide-y divide-slate-200/70">
                {Object.entries(parameter_analysis).map(([param, details]) => (
                  <tr key={param} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-700">{param}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">{details.value}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {getStatusBadge(details.status)}
                      {details.recommendation && (
                        <p className="text-xs text-slate-500 mt-1">{details.recommendation}</p>
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
          <h3 className="text-lg font-semibold mb-3 text-slate-700">Other Suitable Species</h3>
          <div className="space-y-4">
            {suitable_species
              .filter((species) => species.name !== predicted_species)
              .slice(0, 3) // Limit to 3 additional species
              .map((species, index) => (
                <FishSpeciesInfo key={index} species={species} />
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ResultsDisplay

