"use client"
import { useState } from "react"
import { ChevronDown, ChevronRight } from 'lucide-react'

const FishSpeciesInfo = ({ species }) => {
  const [expanded, setExpanded] = useState(false)


  if (!species) return null

  const { name, scientific_name, ideal_ph_range, ideal_temperature_range, ideal_turbidity_range, description } = species

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden backdrop-blur-sm bg-white/80 shadow-sm transition-all hover:shadow-md">
      <div
        className="p-4 flex justify-between items-center cursor-pointer bg-gradient-to-r from-cyan-50/80 to-blue-50/80 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <h4 className="font-bold text-slate-800">{name}</h4>
          {scientific_name && <p className="text-sm text-slate-500 italic">{scientific_name}</p>}
        </div>
        <button className="text-slate-500 hover:text-cyan-600 transition-colors h-8 w-8 rounded-full flex items-center justify-center bg-white/50 hover:bg-white/80">
          {expanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>
      </div>

      {expanded && (
        <div className="p-5 bg-white/70 backdrop-blur-sm">
          {description && <p className="text-sm text-slate-700 mb-4 leading-relaxed">{description}</p>}

          <h5 className="font-medium text-sm text-slate-700 mb-3">Optimal Water Parameters:</h5>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            {ideal_ph_range && (
              <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-50/80 to-blue-50/80 border border-slate-200/50 shadow-sm">
                <span className="text-slate-500 block mb-1">pH Range</span>
                <span className="font-medium text-cyan-700">
                  {ideal_ph_range[0]} - {ideal_ph_range[1]}
                </span>
              </div>
            )}

            {ideal_temperature_range && (
              <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-50/80 to-blue-50/80 border border-slate-200/50 shadow-sm">
                <span className="text-slate-500 block mb-1">Temperature</span>
                <span className="font-medium text-cyan-700">
                  {ideal_temperature_range[0]} - {ideal_temperature_range[1]} °C
                </span>
              </div>
            )}

            {ideal_turbidity_range && (
              <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-50/80 to-blue-50/80 border border-slate-200/50 shadow-sm">
                <span className="text-slate-500 block mb-1">Turbidity</span>
                <span className="font-medium text-cyan-700">
                  {ideal_turbidity_range[0]} - {ideal_turbidity_range[1]} cm
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default FishSpeciesInfo
