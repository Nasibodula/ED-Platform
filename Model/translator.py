"""
English to Oromo Translation Model - Local Usage
Place this file in the same directory as your extracted 'en-om-model' folder
"""

from transformers import MarianMTModel, MarianTokenizer
import torch
import os

class EnglishToOromoTranslator:
    def __init__(self, model_path="./en-om-model"):
        """
        Initialize the translator with your trained model
        
        Args:
            model_path (str): Path to your extracted model folder
        """
        self.model_path = model_path
        self.model = None
        self.tokenizer = None
        
        # Check if model exists
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model not found at {model_path}")
        
        print(f"📦 Loading model from: {model_path}")
        self.load_model()
    
    def load_model(self):
        """Load the model and tokenizer"""
        try:
            self.tokenizer = MarianTokenizer.from_pretrained(self.model_path)
            self.model = MarianMTModel.from_pretrained(self.model_path)
            
            # Set to evaluation mode
            self.model.eval()
            
            print(" Model loaded successfully!")
            print(f"Tokenizer vocab size: {len(self.tokenizer)}")
            
        except Exception as e:
            print(f"Error loading model: {e}")
            raise
    
    def translate(self, text, max_length=128, num_beams=4):
        """
        Translate English text to Oromo
        
        Args:
            text (str): English text to translate
            max_length (int): Maximum length of generated translation
            num_beams (int): Number of beams for beam search
            
        Returns:
            str: Translated Oromo text
        """
        if not text.strip():
            return ""
        
        try:
            # Tokenize input
            inputs = self.tokenizer(
                text, 
                return_tensors="pt", 
                padding=True, 
                truncation=True,
                max_length=max_length
            )
            
            # Generate translation
            with torch.no_grad():
                outputs = self.model.generate(
                    **inputs,
                    max_length=max_length,
                    num_beams=num_beams,
                    early_stopping=True,
                    do_sample=False
                )
            
            # Decode output
            translation = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            return translation
            
        except Exception as e:
            print(f"❌ Translation error: {e}")
            return None
    
    def translate_batch(self, texts, max_length=128, num_beams=4):
        """
        Translate multiple texts at once
        
        Args:
            texts (list): List of English texts to translate
            
        Returns:
            list: List of translated Oromo texts
        """
        translations = []
        
        print(f"🔄 Translating {len(texts)} texts...")
        
        for i, text in enumerate(texts, 1):
            translation = self.translate(text, max_length, num_beams)
            translations.append(translation)
            print(f"✅ {i}/{len(texts)} completed")
        
        return translations

def main():
    """Example usage of the translator"""
    
    # Initialize translator
    try:
        translator = EnglishToOromoTranslator("./en-om-model")
    except FileNotFoundError:
        print("❌ Model folder 'en-om-model' not found!")
        print("📁 Make sure you've extracted the model zip file in the same directory as this script")
        return
    
    # Single translation example
    print("\n" + "="*50)
    print("🔤 SINGLE TRANSLATION EXAMPLE")
    print("="*50)
    
    english_text = "Hello, how are you today?"
    print(f"English: {english_text}")
    
    oromo_translation = translator.translate(english_text)
    if oromo_translation:
        print(f"Oromo: {oromo_translation}")
    
    # Batch translation example
    print("\n" + "="*50)
    print("📝 BATCH TRANSLATION EXAMPLE")
    print("="*50)
    
    english_texts = [
        "Good morning!",
        "Thank you very much.",
        "How can I help you?",
        "Have a nice day!",
        "See you later."
    ]
    
    oromo_translations = translator.translate_batch(english_texts)
    
    print("\n📋 Translation Results:")
    for eng, orm in zip(english_texts, oromo_translations):
        print(f"EN: {eng}")
        print(f"OM: {orm}")
        print("-" * 30)
    
    # Interactive translation
    print("\n" + "="*50)
    print("💬 INTERACTIVE TRANSLATION")
    print("="*50)
    print("Type English text to translate (or 'quit' to exit):")
    
    while True:
        user_input = input("\nEnglish: ").strip()
        
        if user_input.lower() in ['quit', 'exit', 'q']:
            print("👋 Goodbye!")
            break
        
        if user_input:
            translation = translator.translate(user_input)
            if translation:
                print(f"Oromo: {translation}")
            else:
                print("❌ Translation failed")
        else:
            print("⚠️ Please enter some text")

if __name__ == "__main__":
    main()