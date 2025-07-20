# import os

# class Config:
#     DEBUG = True
#     DATASET_DIR = os.path.join(os.path.dirname(__file__), 'datasets')
#     MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')
#     OROMO_DATASET = os.path.join(DATASET_DIR, 'oromo_dataset.txt')
#     ENGLISH_DATASET = os.path.join(DATASET_DIR, 'english_dataset.txt')
#     MODEL_PATH = os.path.join(MODEL_DIR, 'translation_model.pkl')


import os

class Config:
    # Paths to your datasets
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    OROMO_DATASET = os.path.join(BASE_DIR, 'oromo_dataset.txt')
    ENGLISH_DATASET = os.path.join(BASE_DIR, 'english_dataset.txt')
    
    # Model storage path
    MODEL_PATH = os.path.join(BASE_DIR, 'translation_model.joblib')
    
    # Debug mode
    DEBUG = True

import os

class Config:
    # Get the absolute path of the project root directory
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    
    DEBUG = True
    
    # Use absolute paths
    DATASET_DIR = os.path.join(BASE_DIR, 'datasets')
    MODEL_DIR = os.path.join(BASE_DIR, 'models')
    
    # Ensure correct file paths
    OROMO_DATASET = os.path.join(DATASET_DIR, 'oromo_dataset.txt')
    ENGLISH_DATASET = os.path.join(DATASET_DIR, 'english_dataset.txt')
    MODEL_PATH = os.path.join(MODEL_DIR, 'translation_model.pkl')

    # Ensure directories exist
    os.makedirs(DATASET_DIR, exist_ok=True)
    os.makedirs(MODEL_DIR, exist_ok=True)