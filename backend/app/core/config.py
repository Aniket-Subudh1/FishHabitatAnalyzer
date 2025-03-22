from typing import List, Union
from pydantic_settings import BaseSettings
import os


class Settings(BaseSettings):
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Fish Habitat Analyzer"
    
    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000"]
    
    # Model Settings
    BASIC_MODEL_PATH: str = os.path.join("models", "basic_fish_prediction_model.pkl")
    ADVANCED_MODEL_PATH: str = os.path.join("models", "advanced_fish_prediction_model.pkl")
    WATER_QUALITY_MODEL_PATH: str = os.path.join("models", "water_quality_model.pkl")
    
    # Data Settings
    REAL_FISH_DATASET: str = os.path.join("data", "raw", "realfishdataset.csv")
    WATER_QUALITY_DATASET: str = os.path.join("data", "raw", "WQD_with_Fish_Species_v2.csv")
    PROCESSED_DATA_PATH: str = os.path.join("data", "processed")
    
    # Training Settings
    TEST_SIZE: float = 0.2
    RANDOM_STATE: int = 42
    
    class Config:
        env_file = ".env"


settings = Settings()