from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import re
from difflib import get_close_matches
import logging

# Try to import transformers for ML model
try:
    from transformers import MarianMTModel, MarianTokenizer
    import torch
    ML_AVAILABLE = True
except ImportError:
    print(" transformers not installed. Running in dictionary-only mode.")
    print(" To install: pip install transformers torch")
    ML_AVAILABLE = False

# TRANSLATOR CLASS (from your translator.py)

class EnglishToOromoTranslator:
    def __init__(self, model_path="./en-om-model"):
        """Initialize the translator with your trained model"""
        self.model_path = model_path
        self.model = None
        self.tokenizer = None
        
        if not ML_AVAILABLE:
            print("ML libraries not available. Translator will use dictionary only.")
            return
        
        # Check if model exists
        if not os.path.exists(model_path):
            print(f"Model not found at {model_path}. Using dictionary only.")
            return
        
        print(f"Loading model from: {model_path}")
        self.load_model()
    
    def load_model(self):
        """Load the model and tokenizer"""
        if not ML_AVAILABLE:
            return
            
        try:
            self.tokenizer = MarianTokenizer.from_pretrained(self.model_path)
            self.model = MarianMTModel.from_pretrained(self.model_path)
            self.model.eval()
            print("ML Model loaded successfully!")
            print(f"Tokenizer vocab size: {len(self.tokenizer)}")
        except Exception as e:
            print(f"Error loading model: {e}")
            self.model = None
            self.tokenizer = None
    
    def translate(self, text, max_length=128, num_beams=4):
        """Translate English text to Oromo using ML model"""
        if not self.model or not self.tokenizer or not text.strip():
            return None
        
        try:
            inputs = self.tokenizer(
                text, 
                return_tensors="pt", 
                padding=True, 
                truncation=True,
                max_length=max_length
            )
            
            with torch.no_grad():
                outputs = self.model.generate(
                    **inputs,
                    max_length=max_length,
                    num_beams=num_beams,
                    early_stopping=True,
                    do_sample=False
                )
            
            translation = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            return translation
            
        except Exception as e:
            print(f"Translation error: {e}")
            return None

# FLASK API

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global translator instance
translator = None

#mock data
DICTIONARY = {
    "english_to_borana": {
        "hello": [{"borana": "akkam", "type": "greeting"}],
        "hi": [{"borana": "akkam", "type": "greeting"}],
        "water": [{"borana": "bishaan", "type": "noun"}],
        "food": [{"borana": "nyaata", "type": "noun"}],
        "good": [{"borana": "gaarii", "type": "adjective"}],
        "morning": [{"borana": "ganama", "type": "noun"}],
        "thank": [{"borana": "galata", "type": "verb"}],
        "thanks": [{"borana": "galata", "type": "verb"}],
        "you": [{"borana": "ati", "type": "pronoun"}],
        "house": [{"borana": "mana", "type": "noun"}],
        "home": [{"borana": "mana", "type": "noun"}],
        "person": [{"borana": "nama", "type": "noun"}],
        "people": [{"borana": "namoota", "type": "noun"}],
        "day": [{"borana": "guyyaa", "type": "noun"}],
        "night": [{"borana": "halkan", "type": "noun"}],
        "tree": [{"borana": "muka", "type": "noun"}],
        "sun": [{"borana": "aduu", "type": "noun"}],
        "moon": [{"borana": "ji'a", "type": "noun"}],
        "fire": [{"borana": "ibidda", "type": "noun"}],
        "love": [{"borana": "jaalala", "type": "noun"}],
        "peace": [{"borana": "nagaa", "type": "noun"}],
        "come": [{"borana": "kottu", "type": "verb"}],
        "go": [{"borana": "deemi", "type": "verb"}],
        "eat": [{"borana": "nyaadhu", "type": "verb"}],
        "drink": [{"borana": "dhugu", "type": "verb"}],
        "yes": [{"borana": "eeyyee", "type": "interjection"}],
        "no": [{"borana": "lakki", "type": "interjection"}],
        "beautiful": [{"borana": "bareeddu", "type": "adjective"}],
        "big": [{"borana": "guddaa", "type": "adjective"}],
        "small": [{"borana": "xinnaa", "type": "adjective"}],
        "how": [{"borana": "akkam", "type": "adverb"}],
        "what": [{"borana": "maal", "type": "pronoun"}],
        "where": [{"borana": "eessa", "type": "adverb"}],
        "when": [{"borana": "yoom", "type": "adverb"}],
        "who": [{"borana": "eenyu", "type": "pronoun"}],
        "today": [{"borana": "har'a", "type": "adverb"}],
        "tomorrow": [{"borana": "bori", "type": "adverb"}],
        "yesterday": [{"borana": "kaleessa", "type": "adverb"}]
    },
    "borana_to_english": {
        "akkam": [{"english": "hello", "type": "greeting"}],
        "bishaan": [{"english": "water", "type": "noun"}],
        "nyaata": [{"english": "food", "type": "noun"}],
        "gaarii": [{"english": "good", "type": "adjective"}],
        "ganama": [{"english": "morning", "type": "noun"}],
        "galata": [{"english": "thank", "type": "verb"}],
        "ati": [{"english": "you", "type": "pronoun"}],
        "mana": [{"english": "house", "type": "noun"}],
        "nama": [{"english": "person", "type": "noun"}],
        "namoota": [{"english": "people", "type": "noun"}],
        "guyyaa": [{"english": "day", "type": "noun"}],
        "halkan": [{"english": "night", "type": "noun"}],
        "muka": [{"english": "tree", "type": "noun"}],
        "aduu": [{"english": "sun", "type": "noun"}],
        "ji'a": [{"english": "moon", "type": "noun"}],
        "ibidda": [{"english": "fire", "type": "noun"}],
        "jaalala": [{"english": "love", "type": "noun"}],
        "nagaa": [{"english": "peace", "type": "noun"}],
        "kottu": [{"english": "come", "type": "verb"}],
        "deemi": [{"english": "go", "type": "verb"}],
        "nyaadhu": [{"english": "eat", "type": "verb"}],
        "dhugu": [{"english": "drink", "type": "verb"}],
        "eeyyee": [{"english": "yes", "type": "interjection"}],
        "lakki": [{"english": "no", "type": "interjection"}],
        "bareeddu": [{"english": "beautiful", "type": "adjective"}],
        "guddaa": [{"english": "big", "type": "adjective"}],
        "xinnaa": [{"english": "small", "type": "adjective"}],
        "maal": [{"english": "what", "type": "pronoun"}],
        "eessa": [{"english": "where", "type": "adverb"}],
        "yoom": [{"english": "when", "type": "adverb"}],
        "eenyu": [{"english": "who", "type": "pronoun"}],
        "har'a": [{"english": "today", "type": "adverb"}],
        "bori": [{"english": "tomorrow", "type": "adverb"}],
        "kaleessa": [{"english": "yesterday", "type": "adverb"}]
    }
}

def initialize_translator():
    """Initialize the translator if available"""
    global translator
    try:
        model_path = "./en-om-model"
        translator = EnglishToOromoTranslator(model_path)
        logger.info(" Translator initialized")
    except Exception as e:
        logger.error(f" Error initializing translator: {e}")
        translator = None

def get_word_suggestions(query, lang, limit=5):
    """Get word suggestions based on partial input"""
    query = query.lower().strip()
    
    if lang == 'english':
        words = list(DICTIONARY["english_to_borana"].keys())
    else:
        words = list(DICTIONARY["borana_to_english"].keys())
    
    # Filter words that start with the query
    matches = [word for word in words if word.lower().startswith(query)]
    
    # If no exact matches, use fuzzy matching
    if not matches:
        matches = get_close_matches(query, words, n=limit, cutoff=0.6)
    
    return matches[:limit]

def translate_word(word, source_lang):
    """Translate a single word using dictionary"""
    word = word.lower().strip()
    
    if source_lang == 'english':
        dictionary = DICTIONARY["english_to_borana"]
    else:
        dictionary = DICTIONARY["borana_to_english"]
    
    return dictionary.get(word, [])

def translate_sentence(sentence, source_lang):
    """Translate a sentence"""
    # First try ML model for English to Oromo
    if translator and source_lang == 'english':
        try:
            result = translator.translate(sentence)
            if result and result.strip():
                return result
        except Exception as e:
            logger.error(f"ML translation error: {e}")
    
    # Fallback to word-by-word translation
    words = re.findall(r'\b\w+\b', sentence.lower())
    translated_words = []
    
    for word in words:
        translations = translate_word(word, source_lang)
        if translations:
            if source_lang == 'english':
                translated_words.append(translations[0]['borana'])
            else:
                translated_words.append(translations[0]['english'])
        else:
            translated_words.append(f"[{word}]")  # Mark untranslated words
    
    return " ".join(translated_words)

# API ENDPOINTS

@app.route('/api/dictionary', methods=['GET'])
def get_dictionary_stats():
    """Get dictionary statistics"""
    try:
        english_words = len(DICTIONARY["english_to_borana"])
        borana_words = len(DICTIONARY["borana_to_english"])
        
        stats = {
            "english_words": english_words,
            "borana_words": borana_words,
            "total_entries": english_words + borana_words
        }
        
        return jsonify({
            "success": True,
            "stats": stats
        })
    except Exception as e:
        logger.error(f"Error getting dictionary stats: {e}")
        return jsonify({
            "success": False,
            "message": "Error retrieving dictionary statistics"
        }), 500

@app.route('/api/suggestions', methods=['GET'])
def get_suggestions():
    """Get word suggestions for autocomplete"""
    try:
        query = request.args.get('q', '').strip()
        lang = request.args.get('lang', 'english').lower()
        
        if not query or len(query) < 2:
            return jsonify({
                "success": True,
                "suggestions": []
            })
        
        suggestions = get_word_suggestions(query, lang)
        
        return jsonify({
            "success": True,
            "suggestions": suggestions
        })
    except Exception as e:
        logger.error(f"Error getting suggestions: {e}")
        return jsonify({
            "success": False,
            "suggestions": []
        }), 500

@app.route('/api/translate', methods=['POST'])
def translate():
    """Main translation endpoint"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                "success": False,
                "message": "No data provided"
            }), 400
        
        text = data.get('text', '').strip()
        source_lang = data.get('source_lang', 'english').lower()
        translation_type = data.get('type', 'word').lower()
        
        if not text:
            return jsonify({
                "success": False,
                "message": "No text provided"
            }), 400
        
        logger.info(f"Translating: '{text}' from {source_lang} ({translation_type})")
        
        if translation_type == 'word':
            # Word translation
            translations = translate_word(text, source_lang)
            
            if translations:
                return jsonify({
                    "success": True,
                    "translations": translations,
                    "original": text,
                    "source_lang": source_lang,
                    "type": "word"
                })
            else:
                # Get suggestions for similar words
                suggestions = get_word_suggestions(text, source_lang)
                return jsonify({
                    "success": False,
                    "message": f"Translation not found for '{text}'",
                    "suggestions": suggestions,
                    "original": text
                })
        
        else:
            # Sentence translation
            translation = translate_sentence(text, source_lang)
            
            if translation:
                return jsonify({
                    "success": True,
                    "translation": translation,
                    "original": text,
                    "source_lang": source_lang,
                    "type": "sentence"
                })
            else:
                return jsonify({
                    "success": False,
                    "message": "Translation failed",
                    "original": text
                })
    
    except Exception as e:
        logger.error(f"Translation error: {e}")
        return jsonify({
            "success": False,
            "message": "Internal server error"
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    ml_available = translator is not None and translator.model is not None
    return jsonify({
        "status": "healthy",
        "ml_model_available": ml_available,
        "dictionary_words": len(DICTIONARY["english_to_borana"]),
        "translation_modes": ["dictionary"] + (["ml_model"] if ml_available else [])
    })

@app.route('/', methods=['GET'])
def index():
    """Root endpoint with API info"""
    ml_status = " Available" if (translator and translator.model) else " Dictionary only"
    
    return jsonify({
        "message": "English-Oromo/Borana Translation API",
        "version": "1.0.0",
        "ml_model_status": ml_status,
        "dictionary_size": len(DICTIONARY["english_to_borana"]),
        "endpoints": {
            "translate": "POST /api/translate",
            "suggestions": "GET /api/suggestions",
            "dictionary": "GET /api/dictionary",
            "health": "GET /api/health"
        },
        "usage": {
            "start_ui": "Open your React app and it will connect automatically",
            "test_api": "POST to /api/translate with {'text': 'hello', 'source_lang': 'english', 'type': 'word'}"
        }
    })

# MAIN - START THE APP

# if __name__ == '__main__':
#     print("=" * 60)
#     print(" ENGLISH-OROMO/BORANA TRANSLATION API")
#     print("=" * 60)
    
#     # Initialize translator
#     initialize_translator()
    
#     # Show status
#     if translator and translator.model:
#         print(" ML Model: Available (English → Oromo)")
#     else:
#         print(" Dictionary Mode: Available (English ↔ Borana)")
#         if ML_AVAILABLE:
#             print(" To use ML model: Place 'en-om-model' folder in this directory")
#         else:
#             print(" To install ML support: pip install transformers torch")
    
#     print(f" Dictionary: {len(DICTIONARY['english_to_borana'])} word pairs loaded")
#     print("=" * 60)
#     print(" Server starting at: http://localhost:5001")
#     print(" API Documentation: http://localhost:5001")
#     print(" Your React UI can now connect!")
#     print("=" * 60)
    
#     # Run Flask app
#     app.run(
#         host='0.0.0.0',
#         port=5001,
#         debug=True,
#         threaded=True
#     )


# At the bottom of your Model/app.py file, change this section:

if __name__ == '__main__':
    print("=" * 60)
    print(" ENGLISH-OROMO/BORANA TRANSLATION API")
    print("=" * 60)
    
    # Initialize translator
    initialize_translator()
    
    # Show status
    if translator and translator.model:
        print(" ML Model: Available (English → Oromo)")
    else:
        print(" Dictionary Mode: Available (English ↔ Borana)")
        if ML_AVAILABLE:
            print(" To use ML model: Place 'en-om-model' folder in this directory")
        else:
            print(" To install ML support: pip install transformers torch")
    
    print(f" Dictionary: {len(DICTIONARY['english_to_borana'])} word pairs loaded")
    print("=" * 60)
    print(" Server starting at: http://localhost:5001")  # Changed from 5000 to 5001
    print(" API Documentation: http://localhost:5001")   # Changed from 5000 to 5001
    print(" Your React UI can now connect!")
    print("=" * 60)
    
    # Run Flask app - CHANGED PORT FROM 5000 TO 5001
    app.run(
        host='0.0.0.0',
        port=5001,  # ← CHANGED FROM 5000 TO 5001
        debug=True,
        threaded=True
    )