import json
import torch
import torch.nn as nn
import numpy as np
import matplotlib.pyplot as plt
import os
import time
from collections import Counter
from tqdm import tqdm
import warnings
warnings.filterwarnings('ignore')

# Check device
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Using device: {device}")

class ImprovedVocabulary:
    """Enhanced vocabulary with better handling of unknown words"""
    def __init__(self, max_vocab_size=10000):
        self.word2idx = {'<PAD>': 0, '<UNK>': 1, '< SOS >': 2, '<EOS>': 3}
        self.idx2word = {0: '<PAD>', 1: '<UNK>', 2: '< SOS >', 3: '<EOS>'}
        self.word_count = Counter()
        self.max_vocab_size = max_vocab_size

    def build_vocab(self, sentences, min_freq=2):
        """Build vocabulary with frequency filtering and size limit"""
        for sentence in sentences:
            for word in sentence.split():
                self.word_count[word] += 1
        
        most_common = self.word_count.most_common(self.max_vocab_size - 4)
        
        for word, count in most_common:
            if count >= min_freq and word not in self.word2idx:
                idx = len(self.word2idx)
                self.word2idx[word] = idx
                self.idx2word[idx] = word
        
        print(f"Vocabulary built: {len(self.word2idx)} words (min_freq={min_freq})")

    def sentence_to_indices(self, sentence, add_sos=False, add_eos=True):
        """Convert sentence to indices"""
        indices = []
        if add_sos:
            indices.append(self.word2idx['< SOS >'])
            
        for word in sentence.split():
            if word in self.word2idx:
                indices.append(self.word2idx[word])
            else:
                if word.lower() in self.word2idx:
                    indices.append(self.word2idx[word.lower()])
                else:
                    indices.append(self.word2idx['<UNK>'])
                    
        if add_eos:
            indices.append(self.word2idx['<EOS>'])
        return indices

    def __len__(self):
        return len(self.word2idx)

class SimpleTranslationModel(nn.Module):
    """Simple translation model"""
    def __init__(self, src_vocab_size, tgt_vocab_size, embed_size=128, hidden_size=256, num_layers=1):
        super().__init__()
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        self.tgt_vocab_size = tgt_vocab_size
        
        # Encoder
        self.src_embedding = nn.Embedding(src_vocab_size, embed_size, padding_idx=0)
        self.encoder_lstm = nn.LSTM(embed_size, hidden_size, num_layers, 
                                   batch_first=True, dropout=0.1 if num_layers > 1 else 0)
        
        # Decoder
        self.tgt_embedding = nn.Embedding(tgt_vocab_size, embed_size, padding_idx=0)
        self.decoder_lstm = nn.LSTM(embed_size + hidden_size, hidden_size, num_layers,
                                   batch_first=True, dropout=0.1 if num_layers > 1 else 0)
        
        # Output
        self.output_projection = nn.Linear(hidden_size, tgt_vocab_size)
        self.dropout = nn.Dropout(0.1)

class TranslationTester:
    """Translation model tester"""
    
    def __init__(self, model_path):
        self.device = device
        self.model_path = model_path
        
        # Load checkpoint
        if os.path.exists(model_path):
            self.checkpoint = torch.load(model_path, map_location=self.device)
            print(f"✓ Model loaded from epoch {self.checkpoint.get('epoch', '?')}")
            print(f"  Validation loss: {self.checkpoint.get('val_loss', 'N/A')}")
            print(f"  Accuracy: {self.checkpoint.get('accuracy', 'N/A')}")
        else:
            raise FileNotFoundError(f"Model file not found: {model_path}")
            
        self.src_vocab = None
        self.tgt_vocab = None
        self.model = None
        
    def load_data(self):
        """Load training and test data"""
        print("\n📁 Loading data...")
        
        # Load training data for vocabulary
        try:
            with open('data/train.json', 'r', encoding='utf-8') as f:
                train_data = json.load(f)
            print(f"  ✓ Training data: {len(train_data)} pairs")
        except FileNotFoundError:
            print("  ⚠️ Training data not found, using validation for vocab")
            train_data = []
            
        # Load validation/test data
        try:
            with open('data/validation.json', 'r', encoding='utf-8') as f:
                val_data = json.load(f)
            print(f"  ✓ Validation data: {len(val_data)} pairs")
        except FileNotFoundError:
            print("  ❌ Validation data not found!")
            val_data = []
            
        # Use all data for vocabulary if training is empty
        if not train_data:
            train_data = val_data
            
        self.train_pairs = [(item['source'], item['target']) for item in train_data]
        self.test_pairs = [(item['source'], item['target']) for item in val_data]
        
    def build_vocabularies(self):
        """Build vocabularies from training data"""
        print("\n🔤 Building vocabularies...")
        
        src_sentences = [pair[0] for pair in self.train_pairs]
        tgt_sentences = [pair[1] for pair in self.train_pairs]
        
        self.src_vocab = ImprovedVocabulary(max_vocab_size=5000)
        self.tgt_vocab = ImprovedVocabulary(max_vocab_size=5000)
        
        self.src_vocab.build_vocab(src_sentences, min_freq=1)
        self.tgt_vocab.build_vocab(tgt_sentences, min_freq=1)
        
        print(f"  ✓ Source vocab: {len(self.src_vocab)} words")
        print(f"  ✓ Target vocab: {len(self.tgt_vocab)} words")
        
    def initialize_model(self):
        """Initialize model with trained weights"""
        print("\n🤖 Initializing model...")
        
        self.model = SimpleTranslationModel(
            src_vocab_size=len(self.src_vocab),
            tgt_vocab_size=len(self.tgt_vocab),
            embed_size=128,
            hidden_size=256,
            num_layers=1
        ).to(self.device)
        
        # Load trained weights
        self.model.load_state_dict(self.checkpoint['model_state_dict'])
        self.model.eval()
        
        total_params = sum(p.numel() for p in self.model.parameters())
        print(f"  ✓ Model loaded with {total_params:,} parameters")
        
    def translate_sentence(self, sentence, max_length=20):
        """Translate a single sentence"""
        self.model.eval()
        
        with torch.no_grad():
            # Prepare input
            src_indices = self.src_vocab.sentence_to_indices(sentence, add_eos=True)
            src_tensor = torch.tensor(src_indices).unsqueeze(0).to(self.device)
            
            # Encode
            src_embedded = self.model.src_embedding(src_tensor)
            encoder_outputs, (hidden, cell) = self.model.encoder_lstm(src_embedded)
            
            # Decode
            translated_indices = []
            decoder_input = torch.tensor([[self.tgt_vocab.word2idx['< SOS >']]]).to(self.device)
            
            for _ in range(max_length):
                # Embedding
                embedded = self.model.tgt_embedding(decoder_input)
                
                # Simple attention
                attention_weights = torch.softmax(
                    torch.bmm(hidden[-1:].transpose(0, 1), encoder_outputs.transpose(1, 2)), dim=2
                )
                context = torch.bmm(attention_weights, encoder_outputs)
                
                # Combine and decode
                decoder_input_combined = torch.cat([embedded, context], dim=2)
                output, (hidden, cell) = self.model.decoder_lstm(decoder_input_combined, (hidden, cell))
                
                # Project to vocabulary
                output = self.model.output_projection(output)
                predicted_token = output.argmax(dim=2)
                
                token_idx = predicted_token.item()
                if token_idx == self.tgt_vocab.word2idx['<EOS>']:
                    break
                    
                translated_indices.append(token_idx)
                decoder_input = predicted_token
                
            # Convert to words
            words = []
            for idx in translated_indices:
                word = self.tgt_vocab.idx2word.get(idx, '<UNK>')
                if word not in ['<PAD>', '< SOS >', '<EOS>']:
                    words.append(word)
            
            return ' '.join(words)
    
    def calculate_metrics(self, predictions, references):
        """Calculate basic evaluation metrics"""
        # Word-level accuracy
        correct_words = 0
        total_words = 0
        
        # Sentence-level accuracy
        exact_matches = 0
        
        for pred, ref in zip(predictions, references):
            # Sentence accuracy
            if pred.strip().lower() == ref.strip().lower():
                exact_matches += 1
                
            # Word accuracy
            pred_words = set(pred.lower().split())
            ref_words = set(ref.lower().split())
            
            total_words += len(ref_words)
            correct_words += len(pred_words.intersection(ref_words))
        
        word_accuracy = (correct_words / max(total_words, 1)) * 100
        sentence_accuracy = (exact_matches / len(predictions)) * 100
        
        return word_accuracy, sentence_accuracy
    
    def evaluate_model(self, num_samples=50):
        """Evaluate model on test data"""
        print(f"\n📊 Evaluating model on {min(num_samples, len(self.test_pairs))} samples...")
        
        test_samples = self.test_pairs[:num_samples]
        predictions = []
        references = []
        translation_times = []
        
        # Generate translations
        for src, tgt in tqdm(test_samples, desc="Translating"):
            start_time = time.time()
            prediction = self.translate_sentence(src)
            translation_time = time.time() - start_time
            
            predictions.append(prediction)
            references.append(tgt)
            translation_times.append(translation_time)
        
        # Calculate metrics
        word_acc, sent_acc = self.calculate_metrics(predictions, references)
        avg_time = np.mean(translation_times)
        
        print(f"\n📈 EVALUATION RESULTS:")
        print(f"  Word Accuracy: {word_acc:.2f}%")
        print(f"  Sentence Accuracy: {sent_acc:.2f}%")
        print(f"  Avg Translation Time: {avg_time:.4f}s")
        print(f"  Translations/Second: {1/avg_time:.2f}")
        
        # Show samples
        print(f"\n🔍 SAMPLE TRANSLATIONS:")
        for i in range(min(10, len(test_samples))):
            src, tgt = test_samples[i]
            pred = predictions[i]
            match = "✅" if pred.strip().lower() == tgt.strip().lower() else "❌"
            
            print(f"\n{i+1}. {match}")
            print(f"   EN: {src}")
            print(f"   BO: {tgt}")
            print(f"   Pred: {pred}")
            
        return {
            'word_accuracy': word_acc,
            'sentence_accuracy': sent_acc,
            'avg_time': avg_time,
            'predictions': predictions[:10],
            'references': references[:10]
        }
    
    def interactive_mode(self):
        """Interactive translation mode"""
        print(f"\n💬 INTERACTIVE TRANSLATION MODE")
        print("Enter English sentences to translate (type 'quit' to exit)")
        
        while True:
            try:
                english = input("\n🇺🇸 English: ").strip()
                
                if english.lower() in ['quit', 'exit', 'q']:
                    break
                    
                if not english:
                    continue
                
                start_time = time.time()
                borana = self.translate_sentence(english)
                translation_time = time.time() - start_time
                
                print(f"🇪🇹 Borana: {borana}")
                print(f"⏱️  Time: {translation_time:.3f}s")
                
            except KeyboardInterrupt:
                break
            except Exception as e:
                print(f"❌ Error: {e}")
        
        print("👋 Translation session ended.")
    
    def quick_test(self):
        """Quick test with predefined sentences"""
        print(f"\n⚡ QUICK TEST")
        
        test_sentences = [
            "hello",
            "water", 
            "food",
            "house",
            "good",
            "thank you",
            "how are you",
            "what is your name"
        ]
        
        print("Testing common phrases:")
        for sentence in test_sentences:
            translation = self.translate_sentence(sentence)
            print(f"  {sentence} → {translation}")
    
    def run_full_test(self):
        """Run complete testing pipeline"""
        print("=" * 60)
        print("🚀 ENGLISH-BORANA TRANSLATION MODEL TEST")
        print("=" * 60)
        
        # Load data and setup
        self.load_data()
        self.build_vocabularies() 
        self.initialize_model()
        
        # Quick test
        self.quick_test()
        
        # Full evaluation
        if self.test_pairs:
            results = self.evaluate_model(num_samples=100)
            
            # Save results
            with open('test_results.json', 'w') as f:
                json.dump(results, f, indent=2)
            print(f"\n💾 Results saved to test_results.json")
        
        # Interactive mode option
        choice = input(f"\n❓ Try interactive translation? (y/n): ").lower()
        if choice in ['y', 'yes']:
            self.interactive_mode()
        
        print(f"\n✅ Testing completed!")

def main():
    """Main function"""
    model_path = 'best_improved_model.pth'
    
    if not os.path.exists(model_path):
        print(f"❌ Model file not found: {model_path}")
        print("Please ensure you have trained the model first.")
        print("Expected files:")
        print("  - best_improved_model.pth (trained model)")
        print("  - data/train.json (training data)")  
        print("  - data/validation.json (test data)")
        return
    
    try:
        tester = TranslationTester(model_path)
        tester.run_full_test()
    except Exception as e:
        print(f"❌ Error during testing: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()