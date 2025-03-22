from typing import Generator
from fastapi import Depends
from app.services.prediction import PredictionService
from app.services.model_trainer import ModelTrainingService

# Dependency for getting PredictionService instance
def get_prediction_service() -> Generator[PredictionService, None, None]:
    """Dependency to inject PredictionService instance."""
    service = PredictionService()
    yield service

# Dependency for getting ModelTrainingService instance
def get_training_service() -> Generator[ModelTrainingService, None, None]:
    """Dependency to inject ModelTrainingService instance."""
    service = ModelTrainingService()
    yield service