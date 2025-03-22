"use client"

import { useState, useEffect } from "react"
import Dashboard from "./components/Dashboard"
import PredictionForm from "./components/PredictionForm"
import ResultsDisplay from "./components/ResultsDisplay"
import apiService from "./services/api"
import "./styles/index.css"
import { AlertTriangle, Fish, Droplets, Info, RefreshCw, Waves } from "lucide-react"

function App() {
  const [modelStatus, setModelStatus] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [predictionMode, setPredictionMode] = useState("basic")
  const [predictionResult, setPredictionResult] = useState(null)
  const [parameterInfluence, setParameterInfluence] = useState(null)
  const [currentFormValues, setCurrentFormValues] = useState(null)

  useEffect(() => {
    const fetchModelStatus = async () => {
      try {
        setLoading(true)
        const status = await apiService.getModelStatus()
        setModelStatus(status)

        if (status[predictionMode]?.status === "available") {
          const influence =
            predictionMode === "basic"
              ? await apiService.getBasicParameterInfluence()
              : await apiService.getAdvancedParameterInfluence()
          setParameterInfluence(influence)
        }

        setError(null)
      } catch (err) {
        console.error("Error fetching model status:", err)
        setError("Failed to connect to the server. Please make sure the backend is running.")
      } finally {
        setLoading(false)
      }
    }

    fetchModelStatus()
  }, [predictionMode])

  const handleModeChange = (mode) => {
    setPredictionMode(mode)
    setPredictionResult(null)
    setCurrentFormValues(null)
  }

  const handleTrainModel = async (modelType) => {
    try {
      setLoading(true)
      await apiService.trainModel(modelType)

      const status = await apiService.getModelStatus()
      setModelStatus(status)

      if (modelType === predictionMode) {
        const influence =
          modelType === "basic"
            ? await apiService.getBasicParameterInfluence()
            : await apiService.getAdvancedParameterInfluence()
        setParameterInfluence(influence)
      }

      setError(null)
    } catch (err) {
      console.error(`Error training ${modelType} model:`, err)
      setError(`Failed to train the ${modelType} model. Please check the server logs.`)
    } finally {
      setLoading(false)
    }
  }

  const handlePrediction = async (formData) => {
    try {
      setLoading(true)

      const result =
        predictionMode === "basic"
          ? await apiService.predictBasic(formData)
          : await apiService.predictAdvanced(formData)

      setPredictionResult(result)
      setError(null)
    } catch (err) {
      console.error("Error making prediction:", err)
      setError("Failed to make prediction. Please check the server logs.")
      setPredictionResult(null)
    } finally {
      setLoading(false)
    }
  }

  const handleFormValueChange = (values) => {
    setCurrentFormValues(values)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50">
      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-6 max-w-md w-full flex flex-col items-center">
            <RefreshCw className="h-10 w-10 text-cyan-600 animate-spin mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Processing</h3>
            <p className="text-slate-600 text-center">Please wait while we analyze your data...</p>
          </div>
        </div>
      )}

      <header className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Waves className="w-full h-full text-white" />
        </div>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              <div className="flex items-center">
                <Droplets className="h-8 w-8 mr-3 text-cyan-200" />
                <h1 className="text-3xl font-bold">Fish Habitat Analyzer</h1>
              </div>
              <p className="mt-1 text-cyan-100">Water Quality & Species Prediction System</p>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-300 rounded-full blur-xl opacity-30"></div>
                <Fish className="h-16 w-16 text-white relative z-10" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {error && (
          <div
            className="mb-6 bg-rose-50/80 backdrop-blur-sm border-l-4 border-rose-500 text-rose-700 p-4 rounded-xl shadow-sm"
            role="alert"
          >
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-rose-500" />
              <p>{error}</p>
            </div>
            <div className="mt-2 text-sm text-rose-600">
              <button onClick={() => setError(null)} className="underline hover:text-rose-800 transition-colors">
                Dismiss
              </button>
            </div>
          </div>
        )}

        <Dashboard
          modelStatus={modelStatus}
          onTrainModel={handleTrainModel}
          predictionMode={predictionMode}
          onModeChange={handleModeChange}
          loading={loading}
          parameterInfluence={parameterInfluence}
          predictionResult={predictionResult}
          currentFormValues={currentFormValues}
        />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <PredictionForm
              mode={predictionMode}
              onSubmit={handlePrediction}
              loading={loading}
              parameterInfluence={parameterInfluence}
              onFormChange={handleFormValueChange}
            />
          </div>
          <div>
            {predictionResult ? (
              <ResultsDisplay result={predictionResult} />
            ) : (
              <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-6 border border-slate-200/50 h-full flex flex-col items-center justify-center text-center">
                <Info className="h-12 w-12 text-cyan-600/30 mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">No Prediction Results</h3>
                <p className="text-slate-500 max-w-md">
                  Enter your water parameters in the form and click "Make Prediction" to analyze your aquatic
                  environment.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-gradient-to-r from-slate-800 to-slate-900 text-white mt-12 shadow-inner">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Droplets className="h-6 w-6 mr-2 text-cyan-400" />
                <h3 className="text-lg font-semibold">Fish Habitat Analyzer</h3>
              </div>
              <p className="text-slate-400 text-sm">
                Advanced water quality analysis and fish species prediction system for aquaculture management.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#documentation"
                    className="text-slate-400 hover:text-cyan-300 transition-colors text-sm flex items-center"
                  >
                    <Info className="h-4 w-4 mr-2" />
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#api"
                    className="text-slate-400 hover:text-cyan-300 transition-colors text-sm flex items-center"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                    API Reference
                  </a>
                </li>
                <li>
                  <a
                    href="#help"
                    className="text-slate-400 hover:text-cyan-300 transition-colors text-sm flex items-center"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Help Center
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="mailto:support@fishhabitat.example.com"
                    className="text-slate-400 hover:text-cyan-300 transition-colors text-sm flex items-center"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    aniketsubudhi00@gmail.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+1234567890"
                    className="text-slate-400 hover:text-cyan-300 transition-colors text-sm flex items-center"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-700 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm mb-4 md:mb-0">© 2025 Fish Habitat Analyzer. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#twitter" className="text-slate-400 hover:text-cyan-300 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#github" className="text-slate-400 hover:text-cyan-300 transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#linkedin" className="text-slate-400 hover:text-cyan-300 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

