from typing import Dict, List, Optional, Tuple, Any, Union
import pandas as pd
import numpy as np
import pickle
import os
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler
from app.core.logging import logger
from app.core.config import settings


class BasePredictionModel:
    """Base class for prediction models."""
    
    def __init__(self, model_path: Optional[str] = None):
        self.model = None
        self.scaler = None
        self.feature_names = None
        self.target_name = None
        self.model_path = model_path or settings.MODEL_PATH
        
        # Try to load the model if it exists
        if os.path.exists(self.model_path):
            self.load_model()
    
    def load_model(self) -> None:
        """Load model from disk."""
        try:
            with open(self.model_path, 'rb') as f:
                model_data = pickle.load(f)
                self.model = model_data['model']
                self.scaler = model_data.get('scaler')
                self.feature_names = model_data.get('feature_names')
                self.target_name = model_data.get('target_name')
                self.model_info = model_data.get('model_info', {})
                logger.info(f"Model loaded from {self.model_path}")
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            raise
    
    def save_model(self) -> None:
        """Save model to disk."""
        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        
        try:
            model_data = {
                'model': self.model,
                'scaler': self.scaler,
                'feature_names': self.feature_names,
                'target_name': self.target_name,
                'model_info': self.model_info
            }
            with open(self.model_path, 'wb') as f:
                pickle.dump(model_data, f)
            logger.info(f"Model saved to {self.model_path}")
        except Exception as e:
            logger.error(f"Error saving model: {e}")
            raise
    
    def predict(self, data: Union[pd.DataFrame, Dict]) -> Dict:
        """Make a prediction using the trained model."""
        if not self.model:
            raise ValueError("Model not loaded. Train or load a model first.")
        
        # Convert dict to DataFrame if necessary
        if isinstance(data, dict):
            data = pd.DataFrame([data])
        
        # Ensure data has the expected features
        if not all(feature in data.columns for feature in self.feature_names):
            missing = [f for f in self.feature_names if f not in data.columns]
            raise ValueError(f"Input data missing required features: {missing}")
        
        # Select only the features used by the model
        X = data[self.feature_names].copy()
        
        # Scale if scaler exists
        if self.scaler:
            X = pd.DataFrame(self.scaler.transform(X), columns=self.feature_names)
        
        # Get prediction and probabilities
        prediction = self.model.predict(X)[0]
        probabilities = self.model.predict_proba(X)[0]
        confidence = max(probabilities)
        
        result = {
            'predicted_species': prediction,
            'confidence': float(confidence),
            'probabilities': {
                class_name: float(prob) 
                for class_name, prob in zip(self.model.classes_, probabilities)
            }
        }
        
        return result


class BasicFishPredictionModel(BasePredictionModel):
    """Model for predicting fish species based on basic water parameters."""
    
    def train(self, data_path: str = None, test_size: float = 0.2, random_state: int = 42) -> Dict:
        """Train the model using the simplified dataset."""
        from sklearn.model_selection import train_test_split
        from sklearn.metrics import accuracy_score, f1_score, classification_report
        import time
        
        data_path = data_path or settings.REAL_FISH_DATASET
        
        # Load data
        logger.info(f"Loading data from {data_path}")
        df = pd.read_csv(data_path)
        
        # Basic preprocessing
        df = df.dropna()
        
        # Define features and target
        self.feature_names = ['ph', 'temperature', 'turbidity']
        self.target_name = 'fish'
        
        X = df[self.feature_names]
        y = df[self.target_name]
        
        # Scale features
        self.scaler = StandardScaler()
        X_scaled = self.scaler.fit_transform(X)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X_scaled, y, test_size=test_size, random_state=random_state
        )
        
        # Train model
        start_time = time.time()
        self.model = RandomForestClassifier(n_estimators=100, random_state=random_state)
        self.model.fit(X_train, y_train)
        training_time = time.time() - start_time
        
        # Evaluate model
        y_pred = self.model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred, average='weighted')
        report = classification_report(y_test, y_pred, output_dict=True)
        
        # Save model info
        self.model_info = {
            'model_type': 'basic',
            'accuracy': accuracy,
            'f1_score': f1,
            'training_time': training_time,
            'feature_names': self.feature_names,
            'classification_report': report
        }
        
        # Save model
        self.save_model()
        
        return {
            'model_type': 'basic',
            'accuracy': accuracy,
            'f1_score': f1,
            'training_time': training_time,
            'model_path': self.model_path
        }
    
    def get_parameter_influence(self) -> Dict:
        """Get the influence of each parameter on the predictions."""
        if not self.model:
            raise ValueError("Model not loaded. Train or load a model first.")
        
        # Get feature importances
        importances = self.model.feature_importances_
        feature_importance = {
            feature: float(importance)
            for feature, importance in zip(self.feature_names, importances)
        }
        
        # Define optimal ranges (these could be derived from data analysis)
        optimal_ranges = {
            'ph': [6.5, 8.5],
            'temperature': [22.0, 30.0],
            'turbidity': [30.0, 80.0]
        }
        
        return {
            'parameter_importance': feature_importance,
            'optimal_ranges': optimal_ranges
        }


class AdvancedFishPredictionModel(BasePredictionModel):
    """Model for predicting fish species based on comprehensive water parameters."""
    
    def train(self, data_path: str = None, test_size: float = 0.2, random_state: int = 42) -> Dict:
        """Train the model using the comprehensive dataset."""
        from sklearn.model_selection import train_test_split
        from sklearn.metrics import accuracy_score, f1_score, classification_report
        import time
        
        data_path = data_path or settings.WATER_QUALITY_DATASET
        
        # Load data
        logger.info(f"Loading data from {data_path}")
        df = pd.read_csv(data_path)
        
        # Basic preprocessing
        df = df.dropna()
        
        # Map column names to standardized names
        column_mapping = {
            'Temp': 'temperature',
            'Turbidity (cm)': 'turbidity',
            'DO(mg/L)': 'dissolved_oxygen',
            'BOD (mg/L)': 'bod',
            'CO2': 'co2',
            'pH`': 'ph',
            'Alkalinity (mg L-1 )': 'alkalinity',
            'Hardness (mg L-1 )': 'hardness',
            'Calcium (mg L-1 )': 'calcium',
            'Ammonia (mg L-1 )': 'ammonia',
            'Nitrite (mg L-1 )': 'nitrite',
            'Phosphorus (mg L-1 )': 'phosphorus',
            'H2S (mg L-1 )': 'h2s',
            'Plankton (No. L-1)': 'plankton',
            'Water Quality': 'water_quality',
            'fish': 'fish'
        }
        
        # Rename columns
        df = df.rename(columns=column_mapping)
        
        # Define features and target
        self.feature_names = [
            'temperature', 'turbidity', 'dissolved_oxygen', 'bod', 'co2', 
            'ph', 'alkalinity', 'hardness', 'calcium', 'ammonia', 
            'nitrite', 'phosphorus', 'h2s', 'plankton'
        ]
        self.target_name = 'fish'
        
        # Ensure all feature columns exist
        for feature in self.feature_names:
            if feature not in df.columns:
                raise ValueError(f"Feature {feature} not found in dataset")
        
        X = df[self.feature_names]
        y = df[self.target_name]
        
        # Scale features
        self.scaler = StandardScaler()
        X_scaled = self.scaler.fit_transform(X)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X_scaled, y, test_size=test_size, random_state=random_state
        )
        
        # Train model
        start_time = time.time()
        self.model = GradientBoostingClassifier(n_estimators=100, random_state=random_state)
        self.model.fit(X_train, y_train)
        training_time = time.time() - start_time
        
        # Evaluate model
        y_pred = self.model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred, average='weighted')
        report = classification_report(y_test, y_pred, output_dict=True)
        
        # Save model info
        self.model_info = {
            'model_type': 'advanced',
            'accuracy': accuracy,
            'f1_score': f1,
            'training_time': training_time,
            'feature_names': self.feature_names,
            'classification_report': report
        }
        
        # Save model
        self.save_model()
        
        return {
            'model_type': 'advanced',
            'accuracy': accuracy,
            'f1_score': f1,
            'training_time': training_time,
            'model_path': self.model_path
        }
    
    def get_parameter_influence(self) -> Dict:
        """Get the influence of each parameter on the predictions."""
        if not self.model:
            raise ValueError("Model not loaded. Train or load a model first.")
        
        # Get feature importances
        importances = self.model.feature_importances_
        feature_importance = {
            feature: float(importance)
            for feature, importance in zip(self.feature_names, importances)
        }
        
        # Define optimal ranges (these should be derived from data analysis)
        optimal_ranges = {
            'ph': [6.5, 8.5],
            'temperature': [22.0, 30.0],
            'turbidity': [30.0, 80.0],
            'dissolved_oxygen': [5.0, 9.0],
            'bod': [0.0, 3.0],
            'co2': [5.0, 15.0],
            'alkalinity': [100.0, 180.0],
            'hardness': [120.0, 200.0],
            'calcium': [30.0, 60.0],
            'ammonia': [0.0, 0.1],
            'nitrite': [0.0, 0.05],
            'phosphorus': [0.0, 0.5],
            'h2s': [0.0, 0.01],
            'plankton': [300.0, 800.0]
        }
        
        return {
            'parameter_importance': feature_importance,
            'optimal_ranges': optimal_ranges
        }


class WaterQualityModel(BasePredictionModel):
    """Model for predicting water quality score based on water parameters."""
    
    def __init__(self, model_path: Optional[str] = None):
        super().__init__(model_path or settings.WATER_QUALITY_MODEL_PATH)
    
    def train(self, data_path: str = None, test_size: float = 0.2, random_state: int = 42) -> Dict:
        """Train the model to predict water quality score."""
        from sklearn.model_selection import train_test_split
        from sklearn.metrics import mean_squared_error, r2_score
        import time
        
        data_path = data_path or settings.WATER_QUALITY_DATASET
        
        # Load data
        logger.info(f"Loading data from {data_path}")
        df = pd.read_csv(data_path)
        
        # Basic preprocessing
        df = df.dropna()
        
        # Map column names to standardized names
        column_mapping = {
            'Temp': 'temperature',
            'Turbidity (cm)': 'turbidity',
            'DO(mg/L)': 'dissolved_oxygen',
            'BOD (mg/L)': 'bod',
            'CO2': 'co2',
            'pH`': 'ph',
            'Alkalinity (mg L-1 )': 'alkalinity',
            'Hardness (mg L-1 )': 'hardness',
            'Calcium (mg L-1 )': 'calcium',
            'Ammonia (mg L-1 )': 'ammonia',
            'Nitrite (mg L-1 )': 'nitrite',
            'Phosphorus (mg L-1 )': 'phosphorus',
            'H2S (mg L-1 )': 'h2s',
            'Plankton (No. L-1)': 'plankton',
            'Water Quality': 'water_quality'
        }
        
        # Rename columns
        df = df.rename(columns=column_mapping)
        
        # Define features and target
        self.feature_names = [
            'temperature', 'turbidity', 'dissolved_oxygen', 'bod', 'co2', 
            'ph', 'alkalinity', 'hardness', 'calcium', 'ammonia', 
            'nitrite', 'phosphorus', 'h2s', 'plankton'
        ]
        self.target_name = 'water_quality'
        
        # Ensure all feature columns exist
        for feature in self.feature_names:
            if feature not in df.columns:
                raise ValueError(f"Feature {feature} not found in dataset")
        
        if self.target_name not in df.columns:
            raise ValueError(f"Target column {self.target_name} not found in dataset")
        
        X = df[self.feature_names]
        y = df[self.target_name]
        
        # Scale features
        self.scaler = StandardScaler()
        X_scaled = self.scaler.fit_transform(X)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X_scaled, y, test_size=test_size, random_state=random_state
        )
        
        # Train model
        start_time = time.time()
        from sklearn.ensemble import GradientBoostingRegressor
        self.model = GradientBoostingRegressor(n_estimators=100, random_state=random_state)
        self.model.fit(X_train, y_train)
        training_time = time.time() - start_time
        
        # Evaluate model
        y_pred = self.model.predict(X_test)
        mse = mean_squared_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        
        # Save model info
        self.model_info = {
            'model_type': 'water_quality',
            'mse': mse,
            'r2_score': r2,
            'training_time': training_time,
            'feature_names': self.feature_names
        }
        
        # Save model
        self.save_model()
        
        return {
            'model_type': 'water_quality',
            'mse': mse,
            'r2_score': r2,
            'training_time': training_time,
            'model_path': self.model_path
        }
    
    def predict(self, data: Union[pd.DataFrame, Dict]) -> float:
        """Predict water quality score."""
        if not self.model:
            raise ValueError("Model not loaded. Train or load a model first.")
        
        # Convert dict to DataFrame if necessary
        if isinstance(data, dict):
            data = pd.DataFrame([data])
        
        # Ensure data has the expected features
        if not all(feature in data.columns for feature in self.feature_names):
            missing = [f for f in self.feature_names if f not in data.columns]
            raise ValueError(f"Input data missing required features: {missing}")
        
        # Select only the features used by the model
        X = data[self.feature_names].copy()
        
        # Scale if scaler exists
        if self.scaler:
            X = pd.DataFrame(self.scaler.transform(X), columns=self.feature_names)
        
        # Get prediction
        prediction = float(self.model.predict(X)[0])
        
        return prediction