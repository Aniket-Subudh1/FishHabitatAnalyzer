"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, CheckCircle, Droplets, RefreshCw } from "lucide-react"

const PredictionForm = ({ mode, onSubmit, loading, parameterInfluence, onFormChange }) => {
  const [basicForm, setBasicForm] = useState({
    ph: 7.2,
    temperature: 28.5,
    turbidity: 45.2,
  })

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
  })

  useEffect(() => {
    if (onFormChange) {
      onFormChange(mode === "basic" ? basicForm : advancedForm)
    }
  }, [basicForm, advancedForm, mode, onFormChange])

  useEffect(() => {
    if (onFormChange) {
      onFormChange(mode === "basic" ? basicForm : advancedForm)
    }
  }, [mode])

  const handleBasicChange = (e) => {
    const { name, value } = e.target
    setBasicForm({
      ...basicForm,
      [name]: Number.parseFloat(value),
    })
  }

  const handleAdvancedChange = (e) => {
    const { name, value } = e.target
    setAdvancedForm({
      ...advancedForm,
      [name]: Number.parseFloat(value),
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(mode === "basic" ? basicForm : advancedForm)
  }

  const getOptimalRangeHint = (param) => {
    if (!parameterInfluence || !parameterInfluence.optimal_ranges) return null

    const range = parameterInfluence.optimal_ranges[param]
    if (!range) return null

    return (
      <span className="text-xs text-slate-500 ml-1">
        (Optimal: {range[0]} - {range[1]})
      </span>
    )
  }

  const getImportance = (param) => {
    if (!parameterInfluence || !parameterInfluence.parameter_importance) return null

    const importance = parameterInfluence.parameter_importance[param]
    if (importance === undefined) return null

    const width = Math.max(5, Math.min(100, importance * 100))

    return (
      <div className="mt-1 h-1 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
          style={{ width: `${width}%` }}
          title={`Parameter importance: ${(importance * 100).toFixed(1)}%`}
        ></div>
      </div>
    )
  }

  const isInOptimalRange = (param, value) => {
    if (!parameterInfluence || !parameterInfluence.optimal_ranges) return true

    const range = parameterInfluence.optimal_ranges[param]
    if (!range) return true

    return value >= range[0] && value <= range[1]
  }

  const getInputBorderClass = (param, value) => {
    if (!parameterInfluence || !parameterInfluence.optimal_ranges) return ""

    return isInOptimalRange(param, value)
      ? "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500"
      : "border-amber-300 focus:border-amber-500 focus:ring-amber-500"
  }

  const getStatusIcon = (param, value) => {
    if (!parameterInfluence || !parameterInfluence.optimal_ranges) return null

    return isInOptimalRange(param, value) ? (
      <CheckCircle className="h-4 w-4 text-emerald-500" />
    ) : (
      <AlertTriangle className="h-4 w-4 text-amber-500" />
    )
  }

  return (
    <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-6 border border-slate-200/50">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
        <Droplets className="mr-2 h-5 w-5 text-cyan-600" />
        {mode === "basic" ? "Basic Prediction" : "Advanced Prediction"}
      </h2>

      <form onSubmit={handleSubmit}>
        {mode === "basic" ? (
          <>
            <div className="mb-4">
              <label className="block text-slate-700 text-sm font-medium mb-2" htmlFor="ph">
                pH {getOptimalRangeHint("ph")}
              </label>
              <div className="relative">
                <input
                  id="ph"
                  name="ph"
                  type="number"
                  step="0.1"
                  min="0"
                  max="14"
                  value={basicForm.ph}
                  onChange={handleBasicChange}
                  className={`shadow-sm appearance-none border rounded-lg w-full py-2.5 px-3 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-opacity-50 ${getInputBorderClass(
                    "ph",
                    basicForm.ph,
                  )}`}
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  {getStatusIcon("ph", basicForm.ph)}
                </div>
              </div>
              {getImportance("ph")}
            </div>

            <div className="mb-4">
              <label className="block text-slate-700 text-sm font-medium mb-2" htmlFor="temperature">
                Temperature (°C) {getOptimalRangeHint("temperature")}
              </label>
              <div className="relative">
                <input
                  id="temperature"
                  name="temperature"
                  type="number"
                  step="0.1"
                  min="0"
                  max="50"
                  value={basicForm.temperature}
                  onChange={handleBasicChange}
                  className={`shadow-sm appearance-none border rounded-lg w-full py-2.5 px-3 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-opacity-50 ${getInputBorderClass(
                    "temperature",
                    basicForm.temperature,
                  )}`}
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  {getStatusIcon("temperature", basicForm.temperature)}
                </div>
              </div>
              {getImportance("temperature")}
            </div>

            <div className="mb-6">
              <label className="block text-slate-700 text-sm font-medium mb-2" htmlFor="turbidity">
                Turbidity (cm) {getOptimalRangeHint("turbidity")}
              </label>
              <div className="relative">
                <input
                  id="turbidity"
                  name="turbidity"
                  type="number"
                  step="0.1"
                  min="0"
                  max="200"
                  value={basicForm.turbidity}
                  onChange={handleBasicChange}
                  className={`shadow-sm appearance-none border rounded-lg w-full py-2.5 px-3 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-opacity-50 ${getInputBorderClass(
                    "turbidity",
                    basicForm.turbidity,
                  )}`}
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  {getStatusIcon("turbidity", basicForm.turbidity)}
                </div>
              </div>
              {getImportance("turbidity")}
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-slate-700 text-sm font-medium mb-2" htmlFor="ph">
                  pH {getOptimalRangeHint("ph")}
                </label>
                <div className="relative">
                  <input
                    id="ph"
                    name="ph"
                    type="number"
                    step="0.1"
                    min="0"
                    max="14"
                    value={advancedForm.ph}
                    onChange={handleAdvancedChange}
                    className={`shadow-sm appearance-none border rounded-lg w-full py-2.5 px-3 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-opacity-50 ${getInputBorderClass(
                      "ph",
                      advancedForm.ph,
                    )}`}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {getStatusIcon("ph", advancedForm.ph)}
                  </div>
                </div>
                {getImportance("ph")}
              </div>

              <div className="mb-4">
                <label className="block text-slate-700 text-sm font-medium mb-2" htmlFor="temperature">
                  Temperature (°C) {getOptimalRangeHint("temperature")}
                </label>
                <div className="relative">
                  <input
                    id="temperature"
                    name="temperature"
                    type="number"
                    step="0.1"
                    min="0"
                    max="50"
                    value={advancedForm.temperature}
                    onChange={handleAdvancedChange}
                    className={`shadow-sm appearance-none border rounded-lg w-full py-2.5 px-3 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-opacity-50 ${getInputBorderClass(
                      "temperature",
                      advancedForm.temperature,
                    )}`}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {getStatusIcon("temperature", advancedForm.temperature)}
                  </div>
                </div>
                {getImportance("temperature")}
              </div>

              <div className="mb-4">
                <label className="block text-slate-700 text-sm font-medium mb-2" htmlFor="turbidity">
                  Turbidity (cm) {getOptimalRangeHint("turbidity")}
                </label>
                <div className="relative">
                  <input
                    id="turbidity"
                    name="turbidity"
                    type="number"
                    step="0.1"
                    min="0"
                    max="200"
                    value={advancedForm.turbidity}
                    onChange={handleAdvancedChange}
                    className={`shadow-sm appearance-none border rounded-lg w-full py-2.5 px-3 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-opacity-50 ${getInputBorderClass(
                      "turbidity",
                      advancedForm.turbidity,
                    )}`}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {getStatusIcon("turbidity", advancedForm.turbidity)}
                  </div>
                </div>
                {getImportance("turbidity")}
              </div>

              <div className="mb-4">
                <label className="block text-slate-700 text-sm font-medium mb-2" htmlFor="DO">
                  Dissolved Oxygen (mg/L) {getOptimalRangeHint("dissolved_oxygen")}
                </label>
                <div className="relative">
                  <input
                    id="DO"
                    name="DO"
                    type="number"
                    step="0.1"
                    min="0"
                    max="20"
                    value={advancedForm.DO}
                    onChange={handleAdvancedChange}
                    className={`shadow-sm appearance-none border rounded-lg w-full py-2.5 px-3 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-opacity-50 ${getInputBorderClass(
                      "dissolved_oxygen",
                      advancedForm.DO,
                    )}`}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {getStatusIcon("dissolved_oxygen", advancedForm.DO)}
                  </div>
                </div>
                {getImportance("dissolved_oxygen")}
              </div>

              <div className="mb-4">
                <label className="block text-slate-700 text-sm font-medium mb-2" htmlFor="bod">
                  BOD (mg/L) {getOptimalRangeHint("bod")}
                </label>
                <div className="relative">
                  <input
                    id="bod"
                    name="bod"
                    type="number"
                    step="0.1"
                    min="0"
                    max="20"
                    value={advancedForm.bod}
                    onChange={handleAdvancedChange}
                    className={`shadow-sm appearance-none border rounded-lg w-full py-2.5 px-3 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-opacity-50 ${getInputBorderClass(
                      "bod",
                      advancedForm.bod,
                    )}`}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {getStatusIcon("bod", advancedForm.bod)}
                  </div>
                </div>
                {getImportance("bod")}
              </div>

              <div className="mb-4">
                <label className="block text-slate-700 text-sm font-medium mb-2" htmlFor="co2">
                  CO₂ (mg/L) {getOptimalRangeHint("co2")}
                </label>
                <div className="relative">
                  <input
                    id="co2"
                    name="co2"
                    type="number"
                    step="0.1"
                    min="0"
                    max="50"
                    value={advancedForm.co2}
                    onChange={handleAdvancedChange}
                    className={`shadow-sm appearance-none border rounded-lg w-full py-2.5 px-3 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-opacity-50 ${getInputBorderClass(
                      "co2",
                      advancedForm.co2,
                    )}`}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {getStatusIcon("co2", advancedForm.co2)}
                  </div>
                </div>
                {getImportance("co2")}
              </div>

              <div className="mb-4">
                <label className="block text-slate-700 text-sm font-medium mb-2" htmlFor="alkalinity">
                  Alkalinity (mg/L) {getOptimalRangeHint("alkalinity")}
                </label>
                <div className="relative">
                  <input
                    id="alkalinity"
                    name="alkalinity"
                    type="number"
                    step="0.1"
                    min="0"
                    value={advancedForm.alkalinity}
                    onChange={handleAdvancedChange}
                    className={`shadow-sm appearance-none border rounded-lg w-full py-2.5 px-3 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-opacity-50 ${getInputBorderClass(
                      "alkalinity",
                      advancedForm.alkalinity,
                    )}`}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {getStatusIcon("alkalinity", advancedForm.alkalinity)}
                  </div>
                </div>
                {getImportance("alkalinity")}
              </div>

              <div className="mb-4">
                <label className="block text-slate-700 text-sm font-medium mb-2" htmlFor="hardness">
                  Hardness (mg/L) {getOptimalRangeHint("hardness")}
                </label>
                <div className="relative">
                  <input
                    id="hardness"
                    name="hardness"
                    type="number"
                    step="0.1"
                    min="0"
                    value={advancedForm.hardness}
                    onChange={handleAdvancedChange}
                    className={`shadow-sm appearance-none border rounded-lg w-full py-2.5 px-3 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-opacity-50 ${getInputBorderClass(
                      "hardness",
                      advancedForm.hardness,
                    )}`}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {getStatusIcon("hardness", advancedForm.hardness)}
                  </div>
                </div>
                {getImportance("hardness")}
              </div>

              <div className="mb-4">
                <label className="block text-slate-700 text-sm font-medium mb-2" htmlFor="calcium">
                  Calcium (mg/L) {getOptimalRangeHint("calcium")}
                </label>
                <div className="relative">
                  <input
                    id="calcium"
                    name="calcium"
                    type="number"
                    step="0.1"
                    min="0"
                    value={advancedForm.calcium}
                    onChange={handleAdvancedChange}
                    className={`shadow-sm appearance-none border rounded-lg w-full py-2.5 px-3 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-opacity-50 ${getInputBorderClass(
                      "calcium",
                      advancedForm.calcium,
                    )}`}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {getStatusIcon("calcium", advancedForm.calcium)}
                  </div>
                </div>
                {getImportance("calcium")}
              </div>

              <div className="mb-4">
                <label className="block text-slate-700 text-sm font-medium mb-2" htmlFor="ammonia">
                  Ammonia (mg/L) {getOptimalRangeHint("ammonia")}
                </label>
                <div className="relative">
                  <input
                    id="ammonia"
                    name="ammonia"
                    type="number"
                    step="0.001"
                    min="0"
                    value={advancedForm.ammonia}
                    onChange={handleAdvancedChange}
                    className={`shadow-sm appearance-none border rounded-lg w-full py-2.5 px-3 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-opacity-50 ${getInputBorderClass(
                      "ammonia",
                      advancedForm.ammonia,
                    )}`}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {getStatusIcon("ammonia", advancedForm.ammonia)}
                  </div>
                </div>
                {getImportance("ammonia")}
              </div>

              <div className="mb-4">
                <label className="block text-slate-700 text-sm font-medium mb-2" htmlFor="nitrite">
                  Nitrite (mg/L) {getOptimalRangeHint("nitrite")}
                </label>
                <div className="relative">
                  <input
                    id="nitrite"
                    name="nitrite"
                    type="number"
                    step="0.001"
                    min="0"
                    value={advancedForm.nitrite}
                    onChange={handleAdvancedChange}
                    className={`shadow-sm appearance-none border rounded-lg w-full py-2.5 px-3 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-opacity-50 ${getInputBorderClass(
                      "nitrite",
                      advancedForm.nitrite,
                    )}`}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {getStatusIcon("nitrite", advancedForm.nitrite)}
                  </div>
                </div>
                {getImportance("nitrite")}
              </div>

              <div className="mb-4">
                <label className="block text-slate-700 text-sm font-medium mb-2" htmlFor="phosphorus">
                  Phosphorus (mg/L) {getOptimalRangeHint("phosphorus")}
                </label>
                <div className="relative">
                  <input
                    id="phosphorus"
                    name="phosphorus"
                    type="number"
                    step="0.001"
                    min="0"
                    value={advancedForm.phosphorus}
                    onChange={handleAdvancedChange}
                    className={`shadow-sm appearance-none border rounded-lg w-full py-2.5 px-3 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-opacity-50 ${getInputBorderClass(
                      "phosphorus",
                      advancedForm.phosphorus,
                    )}`}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {getStatusIcon("phosphorus", advancedForm.phosphorus)}
                  </div>
                </div>
                {getImportance("phosphorus")}
              </div>

              <div className="mb-4">
                <label className="block text-slate-700 text-sm font-medium mb-2" htmlFor="h2s">
                  H₂S (mg/L) {getOptimalRangeHint("h2s")}
                </label>
                <div className="relative">
                  <input
                    id="h2s"
                    name="h2s"
                    type="number"
                    step="0.001"
                    min="0"
                    value={advancedForm.h2s}
                    onChange={handleAdvancedChange}
                    className={`shadow-sm appearance-none border rounded-lg w-full py-2.5 px-3 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-opacity-50 ${getInputBorderClass(
                      "h2s",
                      advancedForm.h2s,
                    )}`}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {getStatusIcon("h2s", advancedForm.h2s)}
                  </div>
                </div>
                {getImportance("h2s")}
              </div>

              <div className="mb-4">
                <label className="block text-slate-700 text-sm font-medium mb-2" htmlFor="plankton">
                  Plankton (No. L⁻¹) {getOptimalRangeHint("plankton")}
                </label>
                <div className="relative">
                  <input
                    id="plankton"
                    name="plankton"
                    type="number"
                    step="1"
                    min="0"
                    value={advancedForm.plankton}
                    onChange={handleAdvancedChange}
                    className={`shadow-sm appearance-none border rounded-lg w-full py-2.5 px-3 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-opacity-50 ${getInputBorderClass(
                      "plankton",
                      advancedForm.plankton,
                    )}`}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {getStatusIcon("plankton", advancedForm.plankton)}
                  </div>
                </div>
                {getImportance("plankton")}
              </div>
            </div>
          </>
        )}

        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-medium py-2.5 px-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                Predicting...
              </span>
            ) : (
              "Make Prediction"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PredictionForm

