# Dataset preprocessing for VS Code with local files
import pandas as pd
import os
import random

# Check GPU availability (optional - not used in this preprocessing script)
try:
    import torch
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"🔧 PyTorch device: {device}")
    if torch.cuda.is_available():
        print(f"🚀 GPU: {torch.cuda.get_device_name(0)}")
        print(f"💾 GPU Memory: {torch.cuda.get_device_properties(0).total_memory / 1024**3:.1f} GB")
    else:
        print("⚠️  GPU not available - using CPU")
    print()
except ImportError:
    print("📦 PyTorch not installed - GPU check skipped")
    print("   (This preprocessing script doesn't need GPU anyway)")
    print()

# === CONFIG ===
INPUT_DIR = "../datasets"  # Directory containing your input files
OUTPUT_DIR = "processed_dataset"  # Directory to save processed files
ENG_FILE = "eng.txt"
ORM_FILE = "orm.txt"
SPLIT_RATIO = [0.8, 0.1, 0.1]  # train, val, test

# === VERIFY FILES EXIST ===
eng_path = os.path.join(INPUT_DIR, ENG_FILE)
orm_path = os.path.join(INPUT_DIR, ORM_FILE)

print(f"📁 Looking for files:")
print(f"   English: {eng_path}")
print(f"   Oromo: {orm_path}")

if not os.path.exists(eng_path):
    print(f"❌ English file not found: {eng_path}")
    print("   Please make sure the file exists and the path is correct.")
    exit()

if not os.path.exists(orm_path):
    print(f"❌ Oromo file not found: {orm_path}")
    print("   Please make sure the file exists and the path is correct.")
    exit()

print("✅ Both files found!")

# === 1. LOAD DATA ===
print("\nLoading data...")
with open(eng_path, "r", encoding="utf-8") as f:
    eng_lines = [line.strip() for line in f.readlines()]

with open(orm_path, "r", encoding="utf-8") as f:
    orm_lines = [line.strip() for line in f.readlines()]

print(f"English lines loaded: {len(eng_lines)}")
print(f"Oromo lines loaded: {len(orm_lines)}")

assert len(eng_lines) == len(orm_lines), f"Mismatch: {len(eng_lines)} English vs {len(orm_lines)} lines."

# === 2. CLEAN DATA ===
print("\nCleaning data...")
original_count = len(eng_lines)
data = [(en, om) for en, om in zip(eng_lines, orm_lines)
        if en and om and len(en.split()) > 1 and len(om.split()) > 1]

print(f"Original sentence pairs: {original_count}")
print(f"Cleaned sentence pairs: {len(data)}")
print(f"Removed pairs: {original_count - len(data)}")

# === 3. SHUFFLE & SPLIT ===
print("\nShuffling and splitting data...")
random.seed(42)  # For reproducibility
random.shuffle(data)

train_size = int(len(data) * SPLIT_RATIO[0])
val_size = int(len(data) * SPLIT_RATIO[1])

train_data = data[:train_size]
val_data = data[train_size:train_size+val_size]
test_data = data[train_size+val_size:]

print(f"Train size: {len(train_data)}")
print(f"Validation size: {len(val_data)}")
print(f"Test size: {len(test_data)}")

# === 4. CONVERT TO DATAFRAMES & SAVE ===
def to_df(data):
    return pd.DataFrame(data, columns=["en", "om"])

print(f"\nSaving datasets to {OUTPUT_DIR}/...")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Save datasets
train_df = to_df(train_data)
val_df = to_df(val_data)
test_df = to_df(test_data)

train_path = os.path.join(OUTPUT_DIR, "train.csv")
val_path = os.path.join(OUTPUT_DIR, "val.csv")
test_path = os.path.join(OUTPUT_DIR, "test.csv")

train_df.to_csv(train_path, index=False)
val_df.to_csv(val_path, index=False)
test_df.to_csv(test_path, index=False)

print("✅ Dataset prepared and saved!")
print(f"📁 Output directory: {os.path.abspath(OUTPUT_DIR)}")
print(f"📄 Files created:")
print(f"   - {train_path} ({len(train_data)} pairs)")
print(f"   - {val_path} ({len(val_data)} pairs)")
print(f"   - {test_path} ({len(test_data)} pairs)")

# Show sample data
print(f"\n📋 Sample data from training set:")
print(train_df.head(3))

print("\n🎉 Data preprocessing complete!")
print(f"Your datasets are ready for training in the '{OUTPUT_DIR}/' directory.")

# === 5. BASIC STATISTICS ===
print(f"\n📊 Dataset Statistics:")
print(f"Average English sentence length: {sum(len(pair[0].split()) for pair in data) / len(data):.1f} words")
print(f"Average Oromo sentence length: {sum(len(pair[1].split()) for pair in data) / len(data):.1f} words")
print(f"Longest English sentence: {max(len(pair[0].split()) for pair in data)} words")
print(f"Longest Oromo sentence: {max(len(pair[1].split()) for pair in data)} words")