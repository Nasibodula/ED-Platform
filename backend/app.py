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
    """Parse a single dictionary entry where one English word can have multiple Borana translations"""
    entries = []
    entry_text = entry_text.strip()
    
    if not entry_text:
        return entries
    
    # Extract word type
    word_type = ""
    if ' n.-' in entry_text:
        word_type = "noun"
        entry_text = entry_text.replace(' n.-', ' ')
    elif ' v.-' in entry_text:
        word_type = "verb" 
        entry_text = entry_text.replace(' v.-', ' ')
    elif ' adj.-' in entry_text:
        word_type = "adjective"
        entry_text = entry_text.replace(' adj.-', ' ')
    elif ' adv.-' in entry_text:
        word_type = "adverb"
        entry_text = entry_text.replace(' adv.-', ' ')
    
    # Split English and Borana parts
    if '-' not in entry_text:
        return entries
        
    parts = entry_text.split('-', 1)
    if len(parts) != 2:
        return entries
        
    english_part = parts[0].strip()
    borana_part = parts[1].strip()
    
    # Handle multiple English words (comma separated)
    english_words = []
    for w in english_part.split(','):
        w = w.strip()
        if w:
            # Handle cases like "appear to be" which should be one phrase
            if ' ' in w:
                english_words.append(w.lower())
            else:
                english_words.append(w.lower())
    
    # Handle multiple Borana translations (semicolon separated)
    borana_translations = []
    for trans in borana_part.split(';'):
        trans = trans.strip()
        if trans:
            borana_translations.append(trans)
    
    # Create entries for each English to Borana mapping
    for eng_word in english_words:
        for bor_word in borana_translations:
            entries.append({
                'english': eng_word,
                'borana': bor_word,
                'type': word_type
            })
    
    return entries
    
def load_dictionary_data(self):
    """Load and process dictionary data with proper handling of multiple translations"""
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
    """
    
    # First normalize the data - ensure one entry per line
    normalized_lines = []
    for line in raw_data.strip().split('\n'):
        line = line.strip()
        if not line:
            continue
        
        # Handle cases where multiple entries are on one line
        # Look for word type markers that aren't at the start
        type_markers = [' n.-', ' v.-', ' adj.-', ' adv.-']
        split_positions = []
        
        for marker in type_markers:
            pos = line.find(marker)
            if pos > 0:  # Not at start of line
                split_positions.append(pos)
        
        if split_positions:
            # Split the line into multiple entries
            split_positions.sort()
            start = 0
            for pos in split_positions:
                entry = line[start:pos].strip()
                if entry:
                    # Find which marker comes next
                    for marker in type_markers:
                        if line[pos:].startswith(marker):
                            normalized_lines.append(entry + marker + line[pos+len(marker):].split(';')[0].strip())
                            start = pos + len(marker)
                            # Handle the rest of the translations after ;
                            remaining = line[pos+len(marker):].split(';')[1:]
                            if remaining:
                                normalized_lines[-1] += ';' + ';'.join(remaining).strip()
                            break
            # Add the remaining part
            if start < len(line):
                entry = line[start:].strip()
                if entry:
                    normalized_lines.append(entry)
        else:
            normalized_lines.append(line)
    
    # Now process each normalized line
    for line in normalized_lines:
        entries = self.parse_single_entry(line)
        for entry in entries:
            english = entry['english']
            borana = entry['borana']
            word_type = entry['type']
            
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
        
        # Fuzzy match
        similar = self.find_similar_words(word_clean, dictionary)
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
        print("English Dictionary entries:")
        for eng, translations in list(self.dictionary.items())[:10]:
            print(f"  {eng}: {translations}")
        
        print(f"\nTotal English words: {len(self.dictionary)}")
        print(f"Total Borana words: {len(self.reverse_dictionary)}")

# Initialize translator
translator = BoranaTranslator()

# Debug the dictionary loading
translator.debug_dictionary()

@app.route('/api/translate', methods=['POST'])
def translate():
    """API endpoint for translation"""
    try:
        data = request.get_json()
        text = data.get('text', '')
        source_lang = data.get('source_lang', 'english')
        translation_type = data.get('type', 'word')  # 'word' or 'sentence'
        
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
                    'message': 'Word not found',
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
        'message': 'Borana Translator API is running'
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)