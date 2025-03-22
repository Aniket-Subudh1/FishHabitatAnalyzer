"use client"
import { Activity, AlertTriangle, CheckCircle, Fish, RefreshCw } from 'lucide-react'
import WaterQualityChart from "./WaterQualityChart"

const Dashboard = ({
  modelStatus,
  onTrainModel,
  predictionMode,
  onModeChange,
  loading,
  parameterInfluence,
  predictionResult,
  currentFormValues,
}) => {
  const getStatusBadge = (status) => {
    if (status === "available") {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-emerald-100/80 text-emerald-800 font-medium flex items-center">
          <CheckCircle className="h-3 w-3 mr-1" />
          Available
        </span>
      )
    } else if (status === "error") {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-rose-100/80 text-rose-800 font-medium flex items-center">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Error
        </span>
      )
    } else {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-amber-100/80 text-amber-800 font-medium flex items-center">
          <Activity className="h-3 w-3 mr-1" />
          Not Trained
        </span>
      )
    }
  }

  const getModelAccuracy = (model) => {
    if (model?.status === "available" && model?.info?.accuracy) {
      return `${(model.info.accuracy * 100).toFixed(1)}%`
    }
    return "N/A"
  }

  const getR2Score = (model) => {
    if (model?.status === "available" && model?.info?.r2_score) {
      return model.info.r2_score.toFixed(3)
    }
    return "N/A"
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl overflow-hidden border border-slate-200/50">
        <div className="p-6 border-b border-slate-200/50 bg-gradient-to-r from-cyan-50/80 to-blue-50/80">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <h2 className="text-xl font-bold text-slate-800 flex items-center">
              <Fish className="mr-2 h-5 w-5 text-cyan-600" />
              System Dashboard
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => onModeChange("basic")}
                className={`px-4 py-2 rounded-lg shadow-sm font-medium text-sm transition-all ${
                  predictionMode === "basic"
                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-cyan-100"
                    : "bg-white/80 text-slate-700 hover:bg-white border border-slate-200/50 hover:shadow"
                }`}
                disabled={loading}
              >
                Basic Mode
              </button>
              <button
                onClick={() => onModeChange("advanced")}
                className={`px-4 py-2 rounded-lg shadow-sm font-medium text-sm transition-all ${
                  predictionMode === "advanced"
                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-cyan-100"
                    : "bg-white/80 text-slate-700 hover:bg-white border border-slate-200/50 hover:shadow"
                }`}
                disabled={loading}
              >
                Advanced Mode
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-200/50">
          <div className="p-5 backdrop-blur-sm bg-white/50">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-slate-800">Basic Model</h3>
                <p className="text-xs text-slate-500 mt-1">Simple prediction model</p>
              </div>
              {getStatusBadge(modelStatus.basic?.status || "not_trained")}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50/80">
                <span className="text-sm text-slate-600">Accuracy</span>
                <span className="text-sm font-semibold text-cyan-700">{getModelAccuracy(modelStatus.basic)}</span>
              </div>

              {modelStatus.basic?.info?.f1_score && (
                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50/80">
                  <span className="text-sm text-slate-600">F1 Score</span>
                  <span className="text-sm font-semibold text-cyan-700">
                    {modelStatus.basic.info.f1_score.toFixed(3)}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => onTrainModel("basic")}
              className="w-full mt-2 px-4 py-2 text-sm bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:shadow-md shadow-sm disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              disabled={loading}
            >
              {loading && predictionMode === "basic" ? (
                <span className="flex items-center justify-center">
                  <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                  Training...
                </span>
              ) : (
                "Train Model"
              )}
            </button>
          </div>

          <div className="p-5 backdrop-blur-sm bg-white/50">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-slate-800">Advanced Model</h3>
                <p className="text-xs text-slate-500 mt-1">Comprehensive prediction model</p>
              </div>
              {getStatusBadge(modelStatus.advanced?.status || "not_trained")}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50/80">
                <span className="text-sm text-slate-600">Accuracy</span>
                <span className="text-sm font-semibold text-cyan-700">{getModelAccuracy(modelStatus.advanced)}</span>
              </div>

              {modelStatus.advanced?.info?.f1_score && (
                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50/80">
                  <span className="text-sm text-slate-600">F1 Score</span>
                  <span className="text-sm font-semibold text-cyan-700">
                    {modelStatus.advanced.info.f1_score.toFixed(3)}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => onTrainModel("advanced")}
              className="w-full mt-2 px-4 py-2 text-sm bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:shadow-md shadow-sm disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              disabled={loading}
            >
              {loading && predictionMode === "advanced" ? (
                <span className="flex items-center justify-center">
                  <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                  Training...
                </span>
              ) : (
                "Train Model"
              )}
            </button>
          </div>

          <div className="p-5 backdrop-blur-sm bg-white/50">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-slate-800">Water Quality Model</h3>
                <p className="text-xs text-slate-500 mt-1">Water quality scoring model</p>
              </div>
              {getStatusBadge(modelStatus.water_quality?.status || "not_trained")}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50/80">
                <span className="text-sm text-slate-600">R² Score</span>
                <span className="text-sm font-semibold text-cyan-700">{getR2Score(modelStatus.water_quality)}</span>
              </div>

              {modelStatus.water_quality?.info?.mse && (
                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50/80">
                  <span className="text-sm text-slate-600">MSE</span>
                  <span className="text-sm font-semibold text-cyan-700">
                    {modelStatus.water_quality.info.mse.toFixed(4)}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => onTrainModel("water_quality")}
              className="w-full mt-2 px-4 py-2 text-sm bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:shadow-md shadow-sm disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                  Training...
                </span>
              ) : (
                "Train Model"
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <WaterQualityChart
          predictionMode={predictionMode}
          parameterInfluence={parameterInfluence}
          predictionResult={predictionResult}
          currentFormValues={currentFormValues}
        />
      </div>
    </div>
  )
}

export default Dashboard;
