from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, List, Any, Union

from app.services.prediction import PredictionService
from app.services.model_trainer import ModelTrainingService
from app.api.dependencies import get_prediction_service, get_training_service
from app.models.schemas import (
    BasicFishPredictionRequest,
    AdvancedFishPredictionRequest,
    WaterQualityRequest,
    PredictionResponse,
    TrainingRequest,
    TrainingResponse,
    ParameterInfluenceResponse
)
from app.core.logging import logger

router = APIRouter()

# Prediction endpoints
@router.post("/predict/basic", response_model=PredictionResponse, summary="Predict fish species using basic parameters")
async def predict_basic(
    data: BasicFishPredictionRequest,
    prediction_service: PredictionService = Depends(get_prediction_service)
):
    """
    Predict suitable fish species based on basic water parameters.
    
    This endpoint uses a simpler model that only requires pH, temperature, and turbidity.
    """
    try:
        result = prediction_service.predict_basic(data)
        return result
    except ValueError as e:
        logger.error(f"Validation error in basic prediction: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error in basic prediction: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during prediction"
        )

@router.post("/predict/advanced", response_model=PredictionResponse, summary="Predict fish species using comprehensive parameters")
async def predict_advanced(
    data: AdvancedFishPredictionRequest,
    prediction_service: PredictionService = Depends(get_prediction_service)
):
    """
    Predict suitable fish species based on comprehensive water parameters.
    
    This endpoint uses an advanced model that requires a full set of water quality parameters.
    """
    try:
        result = prediction_service.predict_advanced(data)
        return result
    except ValueError as e:
        logger.error(f"Validation error in advanced prediction: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error in advanced prediction: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during prediction"
        )

@router.post("/water-quality", response_model=float, summary="Predict water quality score")
async def predict_water_quality(
    data: WaterQualityRequest,
    prediction_service: PredictionService = Depends(get_prediction_service)
):
    """
    Predict water quality score based on water parameters.
    
    Returns a score indicating the overall quality of the water.
    """
    try:
        input_data = data.model_dump(by_alias=True)
        # Rename DO to dissolved_oxygen for the model
        if 'DO' in input_data:
            input_data['dissolved_oxygen'] = input_data.pop('DO')
        
        result = prediction_service.water_quality_model.predict(input_data)
        return result
    except ValueError as e:
        logger.error(f"Validation error in water quality prediction: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error in water quality prediction: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during prediction"
        )

# Training endpoints
@router.post("/train", response_model=TrainingResponse, summary="Train a new model")
async def train_model(
    data: TrainingRequest,
    training_service: ModelTrainingService = Depends(get_training_service)
):
    """
    Train a new model of the specified type.
    
    This endpoint allows training or retraining of the prediction models.
    """
    try:
        result = training_service.train_model(
            model_type=data.model_type,
            test_size=data.test_size,
            random_state=data.random_state
        )
        return result
    except ValueError as e:
        logger.error(f"Validation error in model training: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error in model training: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during model training: {str(e)}"
        )

@router.get("/models/status", response_model=Dict[str, Any], summary="Get model status")
async def get_model_status(
    training_service: ModelTrainingService = Depends(get_training_service)
):
    """
    Get the status of all trained models.
    
    Returns information about which models are available and their performance metrics.
    """
    try:
        return training_service.get_model_status()
    except Exception as e:
        logger.error(f"Error getting model status: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while retrieving model status"
        )

# Analysis endpoints
@router.get("/parameters/basic/influence", response_model=ParameterInfluenceResponse, summary="Get influence of basic parameters")
async def get_basic_parameter_influence(
    prediction_service: PredictionService = Depends(get_prediction_service)
):
    """
    Get information about the influence of basic water parameters on fish species.
    
    Returns parameter importance and optimal ranges.
    """
    try:
        model = prediction_service.basic_model
        if not model.model:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Basic model not trained yet"
            )
        
        return model.get_parameter_influence()
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting basic parameter influence: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while retrieving parameter influence"
        )

@router.get("/parameters/advanced/influence", response_model=ParameterInfluenceResponse, summary="Get influence of advanced parameters")
async def get_advanced_parameter_influence(
    prediction_service: PredictionService = Depends(get_prediction_service)
):
    """
    Get information about the influence of advanced water parameters on fish species.
    
    Returns parameter importance and optimal ranges.
    """
    try:
        model = prediction_service.advanced_model
        if not model.model:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Advanced model not trained yet"
            )
        
        return model.get_parameter_influence()
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting advanced parameter influence: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while retrieving parameter influence"
        )