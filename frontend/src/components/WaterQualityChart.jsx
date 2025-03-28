"use client"

import React from "react"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts"
import { Droplets, Info } from "lucide-react"

const WaterQualityChart = ({ predictionMode, parameterInfluence, predictionResult, currentFormValues }) => {
  const [chartData, setChartData] = useState([])
  const [chartTheme] = useState({
    primary: "#0891b2", 
    secondary: "#0e7490", 
    optimal: "#10b981", 
    suboptimal: "#f59e0b",
    background: "#f8fafc", 
    text: "#334155", 
  })

  useEffect(() => {
    if (!parameterInfluence) {
      const defaultData = getDefaultData()
      setChartData(defaultData)
      return
    }

    const { optimal_ranges } = parameterInfluence

    const actualValues = getCurrentValues()

    const newData = []

    for (const [param, range] of Object.entries(optimal_ranges)) {
      if (predictionMode === "basic" && !["ph", "temperature", "turbidity"].includes(param)) {
        continue
      }

      const displayName = formatParameterName(param)

      const value = getValueForParameter(param, actualValues)

      const status = value !== null ? (value >= range[0] && value <= range[1] ? "optimal" : "suboptimal") : null

      const dataPoint = {
        name: displayName,
        optimalMin: range[0],
        optimalMax: range[1],
        optimal: range,
        current: value,
        status: status,
      }

      newData.push(dataPoint)
    }

    if (parameterInfluence.parameter_importance) {
      newData.sort((a, b) => {
        const paramA = deformatParameterName(a.name)
        const paramB = deformatParameterName(b.name)
        return (
          (parameterInfluence.parameter_importance[paramB] || 0) -
          (parameterInfluence.parameter_importance[paramA] || 0)
        )
      })
    }

    setChartData(newData.slice(0, 6))
  }, [predictionMode, parameterInfluence, predictionResult, currentFormValues])

  const getDefaultData = () => {
    if (predictionMode === "basic") {
      return [
        { name: "pH", optimalMin: 6.5, optimalMax: 8.5, optimal: [6.5, 8.5], current: 7.2, status: "optimal" },
        { name: "Temperature", optimalMin: 22, optimalMax: 30, optimal: [22, 30], current: 28.5, status: "optimal" },
        { name: "Turbidity", optimalMin: 30, optimalMax: 80, optimal: [30, 80], current: 45.2, status: "optimal" },
      ]
    } else {
      return [
        { name: "pH", optimalMin: 6.5, optimalMax: 8.5, optimal: [6.5, 8.5], current: 7.2, status: "optimal" },
        { name: "Temperature", optimalMin: 22, optimalMax: 30, optimal: [22, 30], current: 28.5, status: "optimal" },
        {
          name: "Dissolved Oxygen",
          optimalMin: 5,
          optimalMax: 9,
          optimal: [5, 9],
          current: 6.8,
          status: "optimal",
        },
        { name: "CO₂", optimalMin: 5, optimalMax: 15, optimal: [5, 15], current: 10.2, status: "optimal" },
        { name: "Ammonia", optimalMin: 0, optimalMax: 0.1, optimal: [0, 0.1], current: 0.05, status: "optimal" },
      ]
    }
  }

  const getCurrentValues = () => {
    if (currentFormValues) {
      const analysis = {}

      if ("ph" in currentFormValues) {
        analysis.ph = { value: currentFormValues.ph }
      }
      if ("temperature" in currentFormValues) {
        analysis.temperature = { value: currentFormValues.temperature }
      }
      if ("turbidity" in currentFormValues) {
        analysis.turbidity = { value: currentFormValues.turbidity }
      }

      if ("DO" in currentFormValues) {
        analysis.dissolved_oxygen = { value: currentFormValues.DO }
      }
      if ("bod" in currentFormValues) {
        analysis.bod = { value: currentFormValues.bod }
      }
      if ("co2" in currentFormValues) {
        analysis.co2 = { value: currentFormValues.co2 }
      }
      if ("alkalinity" in currentFormValues) {
        analysis.alkalinity = { value: currentFormValues.alkalinity }
      }
      if ("hardness" in currentFormValues) {
        analysis.hardness = { value: currentFormValues.hardness }
      }
      if ("calcium" in currentFormValues) {
        analysis.calcium = { value: currentFormValues.calcium }
      }
      if ("ammonia" in currentFormValues) {
        analysis.ammonia = { value: currentFormValues.ammonia }
      }
      if ("nitrite" in currentFormValues) {
        analysis.nitrite = { value: currentFormValues.nitrite }
      }
      if ("phosphorus" in currentFormValues) {
        analysis.phosphorus = { value: currentFormValues.phosphorus }
      }
      if ("h2s" in currentFormValues) {
        analysis.h2s = { value: currentFormValues.h2s }
      }
      if ("plankton" in currentFormValues) {
        analysis.plankton = { value: currentFormValues.plankton }
      }

      return analysis
    }

    if (predictionResult?.parameter_analysis) {
      return predictionResult.parameter_analysis
    }

    return {}
  }

  const getValueForParameter = (param, values) => {
    if (values && values[param] && values[param].value !== undefined) {
      return values[param].value
    }
    return null
  }

  const formatParameterName = (param) => {
    const nameMap = {
      ph: "pH",
      temperature: "Temperature",
      turbidity: "Turbidity",
      dissolved_oxygen: "Dissolved Oxygen",
      bod: "BOD",
      co2: "CO₂",
      alkalinity: "Alkalinity",
      hardness: "Hardness",
      calcium: "Calcium",
      ammonia: "Ammonia",
      nitrite: "Nitrite",
      phosphorus: "Phosphorus",
      h2s: "H₂S",
      plankton: "Plankton",
    }

    return nameMap[param] || param.charAt(0).toUpperCase() + param.slice(1).replace("_", " ")
  }

  const deformatParameterName = (displayName) => {
    const reverseMap = {
      pH: "ph",
      Temperature: "temperature",
      Turbidity: "turbidity",
      "Dissolved Oxygen": "dissolved_oxygen",
      BOD: "bod",
      "CO₂": "co2",
      Alkalinity: "alkalinity",
      Hardness: "hardness",
      Calcium: "calcium",
      Ammonia: "ammonia",
      Nitrite: "nitrite",
      Phosphorus: "phosphorus",
      "H₂S": "h2s",
      Plankton: "plankton",
    }

    return reverseMap[displayName] || displayName.toLowerCase().replace(" ", "_")
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataPoint = chartData.find((item) => item.name === label)
      if (!dataPoint) return null

      return (
        <div className="bg-white/90 backdrop-blur-sm p-3 border border-slate-200/50 shadow-lg rounded-lg">
          <h3 className="font-bold text-base mb-1 text-slate-800">{label}</h3>
          {dataPoint.current !== null && (
            <div className="flex items-center mb-1">
              <span className="mr-2 text-sm font-medium text-slate-600">Current:</span>
              <span className={`font-bold ${dataPoint.status === "optimal" ? "text-emerald-600" : "text-amber-600"}`}>
                {dataPoint.current}
              </span>
            </div>
          )}
          <div className="text-sm">
            <span className="font-medium text-slate-600">Optimal Range: </span>
            <span className="text-emerald-600 font-medium">
              {dataPoint.optimal[0]} - {dataPoint.optimal[1]}
            </span>
          </div>
          {dataPoint.status && (
            <div className="mt-1">
              <span
                className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                  dataPoint.status === "optimal"
                    ? "bg-emerald-100/80 text-emerald-800"
                    : "bg-amber-100/80 text-amber-800"
                }`}
              >
                {dataPoint.status.charAt(0).toUpperCase() + dataPoint.status.slice(1)}
              </span>
            </div>
          )}
        </div>
      )
    }
    return null
  }

  const getYAxisDomain = () => {
    if (!chartData || chartData.length === 0) return [0, 100]

    let min = Number.POSITIVE_INFINITY
    let max = Number.NEGATIVE_INFINITY

    chartData.forEach((item) => {
      min = Math.min(min, item.optimalMin)
      max = Math.max(max, item.optimalMax)

      if (item.current !== null) {
        min = Math.min(min, item.current)
        max = Math.max(max, item.current)
      }
    })

    min = Math.max(0, min - (max - min) * 0.2)
    max = max + (max - min) * 0.2

    return [min, max]
  }

  return (
    <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl border border-slate-200/50 overflow-hidden">
      <div className="p-5 border-b border-slate-200/50 bg-gradient-to-r from-cyan-50/80 to-blue-50/80">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center">
          <Droplets className="mr-2 h-5 w-5 text-cyan-600" />
          Water Parameters Analysis
        </h3>
        <p className="text-sm text-slate-600 mt-1">
          {currentFormValues
            ? "Watching parameter changes in real-time"
            : predictionResult
              ? "Current water parameters compared to optimal ranges"
              : "Sample water parameters for visualization"}
        </p>
      </div>

      <div className="p-5">
        <div className="h-72 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }} barSize={26} barGap={0}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                tick={{ fill: chartTheme.text, fontSize: 12 }}
                tickLine={{ stroke: "#e2e8f0" }}
                axisLine={{ stroke: "#e2e8f0" }}
              />
              <YAxis
                domain={getYAxisDomain()}
                tick={{ fill: chartTheme.text, fontSize: 12 }}
                tickLine={{ stroke: "#e2e8f0" }}
                axisLine={{ stroke: "#e2e8f0" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} />

              {chartData.map((entry) => (
                <React.Fragment key={entry.name}>
                  <ReferenceLine
                    y={entry.optimalMin}
                    stroke={chartTheme.optimal}
                    strokeDasharray="3 3"
                    isFront={false}
                    segment={[
                      { x: entry.name, y: entry.optimalMin },
                      { x: entry.name, y: entry.optimalMax },
                    ]}
                  />
                  <ReferenceLine
                    y={entry.optimalMax}
                    stroke={chartTheme.optimal}
                    strokeDasharray="3 3"
                    isFront={false}
                    segment={[
                      { x: entry.name, y: entry.optimalMin },
                      { x: entry.name, y: entry.optimalMax },
                    ]}
                  />
                </React.Fragment>
              ))}

              <Bar
                dataKey="optimalMax"
                fillOpacity={0.2}
                stackId="optimal"
                fill={chartTheme.optimal}
                name="Optimal Range"
                legendType="none"
              />
              <Bar dataKey="optimalMin" fillOpacity={0} stackId="optimal" fill="transparent" legendType="none" />

              <Bar
                dataKey="current"
                fill={chartTheme.primary}
                name="Current Value"
                radius={[4, 4, 0, 0]}
                animationDuration={500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="px-5 py-3 bg-gradient-to-r from-slate-50/80 to-slate-100/80 border-t border-slate-200/50">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-cyan-600 mr-2"></div>
            <span className="text-xs text-slate-600">Current Value</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-emerald-500 opacity-20 mr-2"></div>
            <span className="text-xs text-slate-600">Optimal Range</span>
          </div>
          <div className="flex items-center ml-auto">
            <Info className="w-3 h-3 text-slate-400 mr-1" />
            <span className="text-xs text-slate-500">Hover over bars for details</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WaterQualityChart

