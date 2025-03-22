import os
import pandas as pd
import time
from typing import Dict, List, Optional, Union, Any

from app.models.prediction import (
    BasicFishPredictionModel,
    AdvancedFishPredictionModel,
    WaterQualityModel
)
from app.core.logging import logger
from app.core.config import settings


class ModelTrainingService:
    """Service for training and managing ML models."""
    
    def __init__(self):
        """Initialize the model training service."""
        # Ensure model directory exists
        os.makedirs(os.path.dirname(settings.MODEL_PATH), exist_ok=True)
    
    def train_basic_model(self, test_size: float = 0.2, random_state: int = 42) -> Dict[str, Any]:
        """Train the basic fish species prediction model."""
        logger.info("Training basic fish prediction model")
        
        try:
            model = BasicFishPredictionModel()
            result = model.train(
                data_path=settings.REAL_FISH_DATASET,
                test_size=test_size,
                random_state=random_state
            )
            
            logger.info(f"Basic model training completed: accuracy={result['accuracy']:.4f}")
            return result
        
        except Exception as e:
            logger.error(f"Error training basic model: {e}")
            raise
    
    def train_advanced_model(self, test_size: float = 0.2, random_state: int = 42) -> Dict[str, Any]:
        """Train the advanced fish species prediction model."""
        logger.info("Training advanced fish prediction model")
        
        try:
            model = AdvancedFishPredictionModel()
            result = model.train(
                data_path=settings.WATER_QUALITY_DATASET,
                test_size=test_size,
                random_state=random_state
            )
            
            logger.info(f"Advanced model training completed: accuracy={result['accuracy']:.4f}")
            return result
        
        except Exception as e:
            logger.error(f"Error training advanced model: {e}")
            raise
    
    def train_water_quality_model(self, test_size: float = 0.2, random_state: int = 42) -> Dict[str, Any]:
        """Train the water quality prediction model."""
        logger.info("Training water quality model")
        
        try:
            model = WaterQualityModel()
            result = model.train(
                data_path=settings.WATER_QUALITY_DATASET,
                test_size=test_size,
                random_state=random_state
            )
            
            logger.info(f"Water quality model training completed: R² score={result['r2_score']:.4f}")
            return result
        
        except Exception as e:
            logger.error(f"Error training water quality model: {e}")
            raise
    
    def train_model(self, model_type: str, test_size: float = 0.2, random_state: int = 42) -> Dict[str, Any]:
        """Train a model of the specified type."""
        if model_type == "basic":
            return self.train_basic_model(test_size, random_state)
        elif model_type == "advanced":
            return self.train_advanced_model(test_size, random_state)
        elif model_type == "water_quality":
            return self.train_water_quality_model(test_size, random_state)
        else:
            raise ValueError(f"Unknown model type: {model_type}")
    
    def get_model_status(self) -> Dict[str, Any]:
        """Get the status of all models."""
        result = {}
        
        # Check basic model
        basic_model_path = settings.MODEL_PATH
        if os.path.exists(basic_model_path):
            basic_model = BasicFishPredictionModel()
            result["basic"] = {
                "status": "available",
                "info": basic_model.model_info if hasattr(basic_model, "model_info") else {}
            }
        else:
            result["basic"] = {"status": "not_trained"}
        
        # Check advanced model (using the same path for now)
        advanced_model_path = settings.MODEL_PATH
        if os.path.exists(advanced_model_path):
            advanced_model = AdvancedFishPredictionModel()
            result["advanced"] = {
                "status": "available",
                "info": advanced_model.model_info if hasattr(advanced_model, "model_info") else {}
            }
        else:
            result["advanced"] = {"status": "not_trained"}
        
        # Check water quality model
        water_quality_model_path = settings.WATER_QUALITY_MODEL_PATH
        if os.path.exists(water_quality_model_path):
            water_quality_model = WaterQualityModel()
            result["water_quality"] = {
                "status": "available",
                "info": water_quality_model.model_info if hasattr(water_quality_model, "model_info") else {}
            }
        else:
            result["water_quality"] = {"status": "not_trained"}
        
        return result