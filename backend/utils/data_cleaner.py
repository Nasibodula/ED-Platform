import re
import pandas as pd

def clean_text(text):
    """
    Comprehensive text cleaning function
    """
    if not isinstance(text, str):
        return ""
    
    # Convert to lowercase
    text = text.lower()
    
    # Remove special characters and numbers
    text = re.sub(r'[^a-zA-Za-z\s]', '', text)
    
    # Remove extra whitespaces
    text = ' '.join(text.split())
    
    return text

def load_and_clean_datasets(oromo_path, english_path):
    """
    Load and clean parallel datasets
    """
    try:
        # Read datasets
        oromo_data = pd.read_csv(oromo_path, encoding='utf-8', header=None, names=['oromo_text'])
        english_data = pd.read_csv(english_path, encoding='utf-8', header=None, names=['english_text'])
        
        # Ensure same number of rows
        min_length = min(len(oromo_data), len(english_data))
        oromo_data = oromo_data.head(min_length)
        english_data = english_data.head(min_length)
        
        # Clean texts
        oromo_data['cleaned_oromo'] = oromo_data['oromo_text'].apply(clean_text)
        english_data['cleaned_english'] = english_data['english_text'].apply(clean_text)
        
        return oromo_data['cleaned_oromo'], english_data['cleaned_english']
    
    except Exception as e:
        print(f"Dataset loading error: {e}")
        return None, None