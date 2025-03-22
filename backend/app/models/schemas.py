from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any, Union


class BasicFishPredictionRequest(BaseModel):
    """Schema for basic fish prediction request using minimal parameters."""
    ph: float = Field(..., description="Water pH level")
    temperature: float = Field(..., description="Water temperature in Celsius")
    turbidity: float = Field(..., description="Water turbidity in cm")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "ph": 7.2,
                "temperature": 28.5,
                "turbidity": 45.2
            }
        }
    )


class AdvancedFishPredictionRequest(BaseModel):
    """Schema for advanced fish prediction request using all available parameters."""
    temperature: float = Field(..., description="Water temperature in Celsius")
    turbidity: float = Field(..., description="Water turbidity in cm")
    dissolved_oxygen: float = Field(..., alias="DO", description="Dissolved oxygen in mg/L")
    bod: float = Field(..., description="Biological oxygen demand in mg/L")
    co2: float = Field(..., description="Carbon dioxide in mg/L")
    ph: float = Field(..., description="Water pH level")
    alkalinity: float = Field(..., description="Alkalinity in mg/L")
    hardness: float = Field(..., description="Hardness in mg/L")
    calcium: float = Field(..., description="Calcium in mg/L")
    ammonia: float = Field(..., description="Ammonia in mg/L")
    nitrite: float = Field(..., description="Nitrite in mg/L")
    phosphorus: float = Field(..., description="Phosphorus in mg/L")
    h2s: float = Field(..., description="Hydrogen sulfide in mg/L")
    plankton: float = Field(..., description="Plankton count in No. L-1")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "temperature": 28.5,
                "turbidity": 45.2,
                "DO": 6.8,
                "bod": 2.5,
                "co2": 10.2,
                "ph": 7.2,
                "alkalinity": 120.0,
                "hardness": 150.0,
                "calcium": 40.0,
                "ammonia": 0.05,
                "nitrite": 0.01,
                "phosphorus": 0.2,
                "h2s": 0.002,
                "plankton": 500.0
            }
        }
    )


class WaterQualityRequest(BaseModel):
    """Schema for water quality prediction request."""
    temperature: float = Field(..., description="Water temperature in Celsius")
    turbidity: float = Field(..., description="Water turbidity in cm")
    dissolved_oxygen: float = Field(..., alias="DO", description="Dissolved oxygen in mg/L")
    bod: float = Field(..., description="Biological oxygen demand in mg/L")
    co2: float = Field(..., description="Carbon dioxide in mg/L")
    ph: float = Field(..., description="Water pH level")
    alkalinity: float = Field(..., description="Alkalinity in mg/L")
    hardness: float = Field(..., description="Hardness in mg/L")
    calcium: float = Field(..., description="Calcium in mg/L")
    ammonia: float = Field(..., description="Ammonia in mg/L")
    nitrite: float = Field(..., description="Nitrite in mg/L")
    phosphorus: float = Field(..., description="Phosphorus in mg/L")
    h2s: float = Field(..., description="Hydrogen sulfide in mg/L")
    plankton: float = Field(..., description="Plankton count in No. L-1")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "temperature": 28.5,
                "turbidity": 45.2,
                "DO": 6.8,
                "bod": 2.5,
                "co2": 10.2,
                "ph": 7.2,
                "alkalinity": 120.0,
                "hardness": 150.0,
                "calcium": 40.0,
                "ammonia": 0.05,
                "nitrite": 0.01,
                "phosphorus": 0.2,
                "h2s": 0.002,
                "plankton": 500.0
            }
        }
    )


class FishSpeciesInfo(BaseModel):
    """Information about a fish species."""
    name: str
    scientific_name: Optional[str] = None
    ideal_ph_range: Optional[List[float]] = None
    ideal_temperature_range: Optional[List[float]] = None
    ideal_turbidity_range: Optional[List[float]] = None
    description: Optional[str] = None


class PredictionResponse(BaseModel):
    """Schema for prediction response."""
    predicted_species: str
    confidence: float
    water_quality_score: Optional[float] = None
    suitable_species: Optional[List[FishSpeciesInfo]] = None
    parameter_analysis: Optional[Dict[str, Any]] = None
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "predicted_species": "Tilapia",
                "confidence": 0.85,
                "water_quality_score": 7.2,
                "suitable_species": [
                    {
                        "name": "Tilapia",
                        "scientific_name": "Oreochromis niloticus",
                        "ideal_ph_range": [6.5, 8.0],
                        "ideal_temperature_range": [25.0, 30.0],
                        "ideal_turbidity_range": [30.0, 80.0],
                        "description": "Tilapia is a hardy fish that can tolerate a wide range of water conditions."
                    }
                ],
                "parameter_analysis": {
                    "ph": {
                        "value": 7.2,
                        "status": "optimal",
                        "recommendation": None
                    },
                    "temperature": {
                        "value": 28.5,
                        "status": "optimal",
                        "recommendation": None
                    },
                    "turbidity": {
                        "value": 45.2,
                        "status": "optimal",
                        "recommendation": None
                    }
                }
            }
        }
    )


class TrainingRequest(BaseModel):
    """Schema for model training request."""
    model_type: str = Field(..., description="Type of model to train (basic/advanced/water_quality)")
    test_size: float = Field(0.2, description="Proportion of data to use for testing")
    random_state: int = Field(42, description="Random seed for reproducibility")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "model_type": "advanced",
                "test_size": 0.2,
                "random_state": 42
            }
        }
    )


class ClassificationTrainingResponse(BaseModel):
    """Schema for classification model training response."""
    model_type: str
    accuracy: float
    f1_score: float
    training_time: float
    model_path: str
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "model_type": "advanced",
                "accuracy": 0.89,
                "f1_score": 0.87,
                "training_time": 12.5,
                "model_path": "models/advanced_fish_prediction_model.pkl"
            }
        }
    )


class RegressionTrainingResponse(BaseModel):
    """Schema for regression model training response."""
    model_type: str
    mse: float
    r2_score: float
    training_time: float
    model_path: str
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "model_type": "water_quality",
                "mse": 0.03,
                "r2_score": 0.95,
                "training_time": 10.2,
                "model_path": "models/water_quality_model.pkl"
            }
        }
    )


class TrainingResponse(BaseModel):
    """Union schema for any training response."""
    model_type: str
    training_time: float
    model_path: str
    # Optional fields for classification models
    accuracy: Optional[float] = None
    f1_score: Optional[float] = None
    # Optional fields for regression models
    mse: Optional[float] = None
    r2_score: Optional[float] = None
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "model_type": "advanced",
                "accuracy": 0.89,
                "f1_score": 0.87,
                "training_time": 12.5,
                "model_path": "models/advanced_fish_prediction_model.pkl"
            }
        }
    )


class ParameterInfluenceResponse(BaseModel):
    """Schema for parameter influence response."""
    parameter_importance: Dict[str, float]
    optimal_ranges: Dict[str, List[float]]
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "parameter_importance": {
                    "ph": 0.25,
                    "temperature": 0.35,
                    "turbidity": 0.15,
                    "dissolved_oxygen": 0.25
                },
                "optimal_ranges": {
                    "ph": [6.5, 8.0],
                    "temperature": [25.0, 30.0],
                    "turbidity": [30.0, 80.0],
                    "dissolved_oxygen": [5.0, 8.0]
                }
            }
        }
    )