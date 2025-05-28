import json
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from difflib import SequenceMatcher
import pickle
import os
from collections import defaultdict
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import string

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

app = Flask(__name__)
CORS(app)

class BoranaTranslator:
    def __init__(self):
        self.dictionary = {}
        self.reverse_dictionary = {}
        self.word_patterns = {}
        self.grammar_rules = {}
        self.load_dictionary_data()
    
    def parse_single_entry(self, entry_text):
        """Parse a single dictionary entry correctly"""
        entries = []
        entry_text = entry_text.strip()
        
        if not entry_text:
            return entries
        
        # Extract word type (n.-, v.-, adj.-, adv.-)
        word_type = ""
        type_patterns = [
            (' n.-', "noun"),
            (' v.-', "verb"), 
            (' adj.-', "adjective"),
            (' adv.-', "adverb")
        ]
        
        for pattern, type_name in type_patterns:
            if pattern in entry_text:
                word_type = type_name
                # Find the position of the pattern to split correctly
                type_pos = entry_text.find(pattern)
                english_part = entry_text[:type_pos].strip()
                borana_part = entry_text[type_pos + len(pattern):].strip()
                break
        else:
            # No word type found, try to split by first '-'
            if '-' in entry_text:
                parts = entry_text.split('-', 1)
                english_part = parts[0].strip()
                borana_part = parts[1].strip()
            else:
                return entries
        
        # Clean up English part (remove extra spaces)
        english_word = english_part.strip()
        
        # Handle multiple Borana translations (separated by semicolons)
        borana_translations = []
        for translation in borana_part.split(';'):
            translation = translation.strip()
            if translation:
                borana_translations.append(translation)
        
        # Create entries for each Borana translation
        for borana_word in borana_translations:
            entries.append({
                'english': english_word.lower(),
                'borana': borana_word,
                'type': word_type
            })
        
        return entries
    
    def load_dictionary_data(self):
        """Load and process dictionary data with correct parsing"""
        raw_data = """
        appear to be v.- fakkaadha-kaatta
        appear v.- futisa-tifta; futuqa-tuxxa; mulladha-latta 
        appearance n.- ila-ilti; malkii-ni (Amh.); bifa 
        appendix n.- mata xeerii-ni 
        appetite n. (big)- sabdi-ni (person with ) 
        appointment n.- qataroo-ni 
        applaud v.- ililisa-lifta 
        appreciate v.- jaaladha-latta 
        approach n.- dhiaadha-aatta; gareera-ta; uga-ugita 
        approve v.- ee'ee jedha 
        apron n.- (for the back) habaa-ni 
        area n.- reera-i; fullaa-ni 
        argue v.- falama-mta; falma-mita; morka-kita; morma-mita; morooma-mta 
        arm n.- harka-i; irree-ni 
        army n.- hojjaa-ni; waraana-i 
        around adv.- naannoo-ti; marsanii-ni 
        arrange v.- qaba-bita; qaban-nita; saagaa-gita 
        arrest v.- qaba-bita; hidhaa-dita 
        arrive v.- gaadha-atta; dhufaa-ufta 
        arrow n.- xadda-i 
        art n.- ogummaa-i; aadaa-i 
        article n.- barreeffama-i; meeshaa-i 
        artificial adj.- hojii harkaa-tiin 
        artist n.- ogeenya-i; aartistii-ni 
        as conj.- akka-ni; yeroo-ni 
        ash n.- daaraa-i; rakoo-ni 
        ashamed adj.- qaanawa-i; salphaa-i 
        ask v.- gaafadha-atta; barbaacha-atta 
        asleep adj.- hirribaa-i; rafaa-i 
        """
        
        print("Processing dictionary entries...")
        
        # Process each line
        for line_num, line in enumerate(raw_data.strip().split('\n'), 1):
            line = line.strip()
            if not line:
                continue
                
            print(f"Processing line {line_num}: {line}")
            entries = self.parse_single_entry(line)
            
            for entry in entries:
                english = entry['english']
                borana = entry['borana']
                word_type = entry['type']
                
                print(f"  -> English: '{english}' -> Borana: '{borana}' (type: {word_type})")
                
                # Store in English->Borana dictionary
                if english not in self.dictionary:
                    self.dictionary[english] = []
                self.dictionary[english].append({
                    'borana': borana,
                    'type': word_type
                })
                
                # Store in Borana->English dictionary
                if borana not in self.reverse_dictionary:
                    self.reverse_dictionary[borana] = []
                self.reverse_dictionary[borana].append({
                    'english': english,
                    'type': word_type
                })
        
        print(f"\nLoaded {len(self.dictionary)} English words and {len(self.reverse_dictionary)} Borana words")
    
    def find_similar_words(self, word, dictionary, threshold=0.6):
        """Find similar words using fuzzy matching"""
        similar = []
        word_lower = word.lower()
        
        for dict_word in dictionary.keys():
            similarity = SequenceMatcher(None, word_lower, dict_word.lower()).ratio()
            if similarity >= threshold:
                similar.append((dict_word, similarity))
        
        return sorted(similar, key=lambda x: x[1], reverse=True)
    
    def translate_word(self, word, source_lang='english'):
        """Translate a single word"""
        word_clean = word.lower().strip(string.punctuation)
        
        if source_lang == 'english':
            dictionary = self.dictionary
        else:
            dictionary = self.reverse_dictionary
        
        # Direct match
        if word_clean in dictionary:
            return dictionary[word_clean]
        
        # Try partial matches for phrases
        for dict_word in dictionary.keys():
            if word_clean in dict_word or dict_word in word_clean:
                return dictionary[dict_word]
        
        # Fuzzy match
        similar = self.find_similar_words(word_clean, dictionary, threshold=0.7)
        if similar:
            best_match = similar[0][0]
            return dictionary[best_match]
        
        return None
    
    def translate_sentence(self, sentence, source_lang='english'):
        """Translate a full sentence"""
        words = word_tokenize(sentence.lower())
        translations = []
        
        for word in words:
            if word in string.punctuation:
                translations.append(word)
                continue
                
            translation = self.translate_word(word, source_lang)
            if translation and len(translation) > 0:
                # Use the first translation option
                translated_word = translation[0]['borana'] if source_lang == 'english' else translation[0]['english']
                translations.append(translated_word)
            else:
                translations.append(f"[{word}]")  # Mark untranslated words
        
        return ' '.join(translations)
    
    def get_word_suggestions(self, partial_word, source_lang='english', limit=10):
        """Get word suggestions for autocomplete"""
        dictionary = self.dictionary if source_lang == 'english' else self.reverse_dictionary
        suggestions = []
        
        partial_lower = partial_word.lower()
        
        for word in dictionary.keys():
            if word.startswith(partial_lower):
                suggestions.append(word)
        
        return sorted(suggestions)[:limit]
    
    def debug_dictionary(self):
        """Debug method to show what's in the dictionary"""
        print("\n" + "="*50)
        print("DICTIONARY DEBUG INFO")
        print("="*50)
        
        print("\nEnglish -> Borana Dictionary entries:")
        count = 0
        for eng, translations in self.dictionary.items():
            if count < 15:  # Show more entries for debugging
                print(f"  '{eng}' -> {translations}")
                count += 1
        
        print(f"\nBorana -> English Dictionary entries (first 10):")
        count = 0
        for bor, translations in self.reverse_dictionary.items():
            if count < 10:
                print(f"  '{bor}' -> {translations}")
                count += 1
        
        print(f"\nTotal English words: {len(self.dictionary)}")
        print(f"Total Borana words: {len(self.reverse_dictionary)}")
        print("="*50)

# Initialize translator
translator = BoranaTranslator()

# Debug the dictionary loading
translator.debug_dictionary()

@app.route('/api/translate', methods=['POST'])
def translate():
    """API endpoint for translation"""
    try:
        data = request.get_json()
        text = data.get('text', '').strip()
        source_lang = data.get('source_lang', 'english')
        translation_type = data.get('type', 'word')  # 'word' or 'sentence'
        
        if not text:
            return jsonify({
                'success': False,
                'message': 'No text provided'
            })
        
        if translation_type == 'word':
            result = translator.translate_word(text, source_lang)
            if result:
                return jsonify({
                    'success': True,
                    'translations': result,
                    'original': text
                })
            else:
                # Try to find similar words
                dictionary = translator.dictionary if source_lang == 'english' else translator.reverse_dictionary
                similar = translator.find_similar_words(text, dictionary, threshold=0.5)
                suggestions = [word for word, _ in similar[:5]]
                
                return jsonify({
                    'success': False,
                    'message': f'Word "{text}" not found in dictionary',
                    'suggestions': suggestions,
                    'original': text
                })
        else:
            result = translator.translate_sentence(text, source_lang)
            return jsonify({
                'success': True,
                'translation': result,
                'original': text
            })
            
    except Exception as e:
        print(f"Translation error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/suggestions', methods=['GET'])
def get_suggestions():
    """API endpoint for word suggestions"""
    try:
        partial_word = request.args.get('q', '')
        source_lang = request.args.get('lang', 'english')
        
        if len(partial_word) < 2:
            return jsonify({
                'success': True,
                'suggestions': []
            })
        
        suggestions = translator.get_word_suggestions(partial_word, source_lang)
        
        return jsonify({
            'success': True,
            'suggestions': suggestions
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/dictionary', methods=['GET'])
def get_dictionary():
    """Get dictionary statistics"""
    try:
        english_count = len(translator.dictionary)
        borana_count = len(translator.reverse_dictionary)
        
        return jsonify({
            'success': True,
            'stats': {
                'english_words': english_count,
                'borana_words': borana_count,
                'total_entries': english_count + borana_count
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/debug', methods=['GET'])
def debug_endpoint():
    """Debug endpoint to check dictionary contents"""
    try:
        sample_entries = {}
        count = 0
        for eng, translations in translator.dictionary.items():
            if count < 10:  # Show first 10 entries
                sample_entries[eng] = translations
                count += 1
            else:
                break
                
        return jsonify({
            'success': True,
            'sample_entries': sample_entries,
            'total_english_words': len(translator.dictionary),
            'total_borana_words': len(translator.reverse_dictionary)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'success': True,
        'message': 'Borana Translator API is running',
        'dictionary_loaded': len(translator.dictionary) > 0
    })

if __name__ == '__main__':
    print("Starting Borana Translator API...")
    app.run(debug=True, host='0.0.0.0', port=5000)