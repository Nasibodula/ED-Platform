# import os
# import pandas as pd
# import joblib
# import numpy as np
# from sklearn.model_selection import train_test_split
# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.pipeline import Pipeline
# from sklearn.svm import SVC



# def load_and_clean_datasets(oromo_path, english_path):
#     def preprocess_file(input_path, output_path):
#         with open(input_path, 'r', encoding='utf-8') as infile, \
#             open(output_path, 'w', encoding='utf-8') as outfile:
#             for line in infile:
#                 # Remove extra whitespaces, preserve single spaces
#                 cleaned_line = ' '.join(line.split()) + '\n'
#                 outfile.write(cleaned_line)

#     # Use the preprocessed file
#     preprocessed_path = 'cleaned_oromo_dataset.txt'
#     preprocess_file(oromo_path, preprocessed_path)
    
#     """
#     Comprehensive dataset loading with extensive error checking
#     """
#     print("Starting dataset loading...")
#     print(f"Oromo dataset path: {oromo_path}")
#     print(f"English dataset path: {english_path}")

    

#     # Check if files exist
#     if not os.path.exists(oromo_path):
#         print(f"ERROR: Oromo dataset file not found at {oromo_path}")
#         print("Current working directory:", os.getcwd())
#         print("Files in current directory:", os.listdir())
#         raise FileNotFoundError(f"Oromo dataset file not found at {oromo_path}")

#     if not os.path.exists(english_path):
#         print(f"ERROR: English dataset file not found at {english_path}")
#         print("Current working directory:", os.getcwd())
#         print("Files in current directory:", os.listdir())
#         raise FileNotFoundError(f"English dataset file not found at {english_path}")

#     try:
#         # Read datasets with error handling
#         oromo_data = pd.read_csv(oromo_path, encoding='utf-8', header=None, names=['oromo_text'], keep_default_na=False)
#         english_data = pd.read_csv(english_path, encoding='utf-8', header=None, names=['english_text'], keep_default_na=False)

#         print(f"Oromo dataset shape: {oromo_data.shape}")
#         print(f"English dataset shape: {english_data.shape}")

#         # Ensure same number of rows
#         min_length = min(len(oromo_data), len(english_data))
#         oromo_data = oromo_data.head(min_length)
#         english_data = english_data.head(min_length)

#         # Clean texts
#         def clean_text(text):
#             if not isinstance(text, str):
#                 return ""
            
#             # Basic cleaning
#             text = str(text).lower().strip()
            
#             # Remove special characters and extra whitespaces
#             import re
#             text = re.sub(r'[^a-zA-Z\s]', '', text)
#             text = ' '.join(text.split())
            
#             return text

#         oromo_data['cleaned_oromo'] = oromo_data['oromo_text'].apply(clean_text)
#         english_data['cleaned_english'] = english_data['english_text'].apply(clean_text)

#         # Remove empty rows
#         oromo_cleaned = oromo_data['cleaned_oromo'][oromo_data['cleaned_oromo'] != '']
#         english_cleaned = english_data['cleaned_english'][english_data['cleaned_english'] != '']

#         print(f"Cleaned Oromo dataset shape: {oromo_cleaned.shape}")
#         print(f"Cleaned English dataset shape: {english_cleaned.shape}")

#         # Ensure datasets are still aligned
#         min_length = min(len(oromo_cleaned), len(english_cleaned))
#         oromo_cleaned = oromo_cleaned.head(min_length)
#         english_cleaned = english_cleaned.head(min_length)

#         # Print first few rows for verification
#         print("First 5 Oromo texts:")
#         print(oromo_cleaned.head())
#         print("\nFirst 5 English texts:")
#         print(english_cleaned.head())

#         return oromo_cleaned, english_cleaned

#     except Exception as e:
#         print(f"Detailed Error in dataset loading: {e}")
#         import traceback
#         traceback.print_exc()
#         raise

# class TranslationModel:
#     def __init__(self, config):
#         self.config = config
#         self.model = None
    
#     def train_model(self):
#         """
#         Train translation model with comprehensive logging
#         """
#         print("Starting model training...")
        
#         # Load and clean datasets
#         X, y = load_and_clean_datasets(
#             self.config.OROMO_DATASET, 
#             self.config.ENGLISH_DATASET
#         )
        
#         print("Datasets loaded successfully")
        
#         # Split data
#         X_train, X_test, y_train, y_test = train_test_split(
#             X, y, test_size=0.2, random_state=42
#         )
        
#         print(f"Training data shape: {X_train.shape}")
#         print(f"Testing data shape: {X_test.shape}")
        
#         # Create translation pipeline
#         translation_pipeline = Pipeline([
#             ('tfidf', TfidfVectorizer(ngram_range=(1, 2))),
#             ('classifier', SVC(kernel='rbf'))
#         ])
        
#         # Train model
#         translation_pipeline.fit(X_train, y_train)
        
#         # Evaluate model
#         accuracy = translation_pipeline.score(X_test, y_test)
#         print(f"Translation Model Accuracy: {accuracy:.2%}")
        
#         # Ensure model directory exists
#         os.makedirs(os.path.dirname(self.config.MODEL_PATH), exist_ok=True)
        
#         # Save model
#         joblib.dump(translation_pipeline, self.config.MODEL_PATH)
        
#         self.model = translation_pipeline
#         return accuracy
    
#     def load_model(self):
#         """
#         Load pre-trained model with error handling
#         """
#         try:
#             # Check if model file exists
#             if os.path.exists(self.config.MODEL_PATH):
#                 print(f"Loading model from {self.config.MODEL_PATH}")
#                 self.model = joblib.load(self.config.MODEL_PATH)
#                 return True
#             else:
#                 print("No pre-trained model found. Training new model.")
#                 self.train_model()
#                 return False
#         except Exception as e:
#             print(f"Error loading model: {e}")
#             import traceback
#             traceback.print_exc()
            
#             # Attempt to train a new model
#             print("Attempting to train a new model...")
#             self.train_model()
#             return False


import os
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import LabelEncoder

class TranslationModel:
    def __init__(self, config):
        self.config = config
        self.model = None
        self.tfidf_vectorizer = None
        self.label_encoder = None
        self.reverse_label_encoder = None
    
    def load_and_clean_datasets(self, oromo_path, english_path):
        """
        Load and clean datasets with more robust preprocessing
        """
        try:
            # Read datasets
            oromo_data = pd.read_csv(oromo_path, encoding='utf-8', header=None, names=['oromo_text'])
            english_data = pd.read_csv(english_path, encoding='utf-8', header=None, names=['english_text'])

            # Ensure same number of rows
            min_length = min(len(oromo_data), len(english_data))
            oromo_data = oromo_data.head(min_length)
            english_data = english_data.head(min_length)

            # Comprehensive text cleaning
            def advanced_clean_text(text):
                if not isinstance(text, str):
                    return ""
                
                # Convert to lowercase
                text = text.lower()
                
                # Remove special characters and extra whitespaces
                import re
                # Preserve some punctuation and basic word structure
                text = re.sub(r'[^a-z0-9\s\.,!?]', '', text)
                
                # Remove extra whitespaces
                text = ' '.join(text.split())
                
                return text

            # Apply cleaning
            oromo_data['cleaned_oromo'] = oromo_data['oromo_text'].apply(advanced_clean_text)
            english_data['cleaned_english'] = english_data['english_text'].apply(advanced_clean_text)

            # Remove empty rows
            oromo_cleaned = oromo_data[oromo_data['cleaned_oromo'] != '']
            english_cleaned = english_data[english_data['cleaned_english'] != '']

            # Ensure alignment
            min_length = min(len(oromo_cleaned), len(english_cleaned))
            oromo_cleaned = oromo_cleaned.head(min_length)
            english_cleaned = english_cleaned.head(min_length)

            return (
                oromo_cleaned['cleaned_oromo'].tolist(), 
                english_cleaned['cleaned_english'].tolist()
            )

        except Exception as e:
            print(f"Error in dataset loading: {e}")
            raise

    def train_model(self):
        """
        Comprehensive model training with improved vectorization
        """
        print("Starting model training...")
        
        # Load and clean datasets
        X, y = self.load_and_clean_datasets(
            self.config.OROMO_DATASET, 
            self.config.ENGLISH_DATASET
        )
        
        # Encode target labels
        self.label_encoder = LabelEncoder()
        y_encoded = self.label_encoder.fit_transform(y)
        
        # Store reverse mapping for decoding
        self.reverse_label_encoder = {
            idx: label for idx, label in enumerate(self.label_encoder.classes_)
        }
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y_encoded, test_size=0.2, random_state=42
        )
        
        # Create more sophisticated vectorization pipeline
        self.tfidf_vectorizer = TfidfVectorizer(
            ngram_range=(1, 3),  # Use unigrams, bigrams, and trigrams
            max_features=5000,   # Limit features to reduce noise
            lowercase=True,
            strip_accents='unicode'
        )
        
        # Vectorize input
        X_train_vectorized = self.tfidf_vectorizer.fit_transform(X_train)
        X_test_vectorized = self.tfidf_vectorizer.transform(X_test)
        
        # Train model with cosine similarity based approach
        from sklearn.neighbors import NearestNeighbors
        
        self.model = NearestNeighbors(
            n_neighbors=5,  # Find 5 closest matches
            metric='cosine',
            algorithm='brute'
        )
        
        self.model.fit(X_train_vectorized)
        
        # Calculate accuracy by checking if the top match is correct
        total_correct = 0
        for i, query in enumerate(X_test_vectorized):
            # Find nearest neighbors
            distances, indices = self.model.kneighbors(query.reshape(1, -1))
            
            # Check if the top match's label matches the true label
            predicted_label_index = indices[0][0]
            if y_train[predicted_label_index] == y_test[i]:
                total_correct += 1
        
        accuracy = total_correct / len(y_test)
        print(f"Translation Model Accuracy: {accuracy:.2%}")
        
        # Save model components
        os.makedirs(os.path.dirname(self.config.MODEL_PATH), exist_ok=True)
        joblib.dump({
            'model': self.model,
            'tfidf_vectorizer': self.tfidf_vectorizer,
            'label_encoder': self.label_encoder,
            'reverse_label_encoder': self.reverse_label_encoder
        }, self.config.MODEL_PATH)
        
        return accuracy

    def load_model(self):
        """
        Load pre-trained model with comprehensive error handling
        """
        try:
            if os.path.exists(self.config.MODEL_PATH):
                print(f"Loading model from {self.config.MODEL_PATH}")
                model_components = joblib.load(self.config.MODEL_PATH)
                
                self.model = model_components['model']
                self.tfidf_vectorizer = model_components['tfidf_vectorizer']
                self.label_encoder = model_components['label_encoder']
                self.reverse_label_encoder = model_components['reverse_label_encoder']
                
                return True
            else:
                print("No pre-trained model found. Training new model.")
                self.train_model()
                return False
        except Exception as e:
            print(f"Error loading model: {e}")
            self.train_model()
            return False

    def translate(self, input_text):
        """
        Advanced translation method
        """
        # Ensure model is loaded
        if self.model is None:
            self.load_model()
        
        # Clean input text
        def advanced_clean_text(text):
            import re
            text = str(text).lower()
            text = re.sub(r'[^a-z0-9\s\.,!?]', '', text)
            text = ' '.join(text.split())
            return text
        
        cleaned_input = advanced_clean_text(input_text)
        
        # Vectorize input
        input_vectorized = self.tfidf_vectorizer.transform([cleaned_input])
        
        try:
            # Find nearest neighbors
            distances, indices = self.model.kneighbors(input_vectorized)
            
            # Get the translations of the nearest neighbors
            translations = [
                self.reverse_label_encoder[self.label_encoder.transform([y])[0]] 
                for y in [self.label_encoder.classes_[idx] for idx in indices[0]]
            ]
            
            # Return the first (closest) translation
            return translations[0] if translations else "Translation not found"
        
        except Exception as e:
            print(f"Translation error: {e}")
            return f"Translation failed: {str(e)}"

# Utility function for text cleaning
def clean_text(text):
    import re
    text = str(text).lower()
    text = re.sub(r'[^a-z0-9\s\.,!?]', '', text)
    text = ' '.join(text.split())
    return text