import logging
import sys
from typing import Any, Dict, List, Optional

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)


def get_logger(name: str) -> logging.Logger:
    """
    Get a logger instance with the given name.
    
    Args:
        name: The name for the logger
        
    Returns:
        A configured logger instance
    """
    logger = logging.getLogger(name)
    return logger


# Create a logger for the app
logger = get_logger("fish-habitat-analyzer")