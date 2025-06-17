from transformers import MarianMTModel, MarianTokenizer, Seq2SeqTrainer, Seq2SeqTrainingArguments, DataCollatorForSeq2Seq
from datasets import Dataset, DatasetDict
import pandas as pd
import torch

# ✅ 1. Load data from CSV files
def load_csv_data(train_path, val_path):
    """Load CSV data and convert to HuggingFace Dataset format"""
    # Load CSV files
    train_df = pd.read_csv(train_path)
    val_df = pd.read_csv(val_path)
    
    # Convert to the format expected by the model
    def df_to_dataset(df):
        data = []
        for _, row in df.iterrows():
            data.append({
                "translation": {
                    "en": str(row["en"]),
                    "om": str(row["om"])
                }
            })
        return Dataset.from_list(data)
    
    return DatasetDict({
        "train": df_to_dataset(train_df),
        "validation": df_to_dataset(val_df)
    })

# Load the data
data = load_csv_data("processed_dataset/train.csv", "processed_dataset/val.csv")

print(f"Training examples: {len(data['train'])}")
print(f"Validation examples: {len(data['validation'])}")
print(f"Sample training example: {data['train'][0]}")

# ✅ 2. Load pre-trained MarianMT model & tokenizer
model_name = "Helsinki-NLP/opus-mt-en-ROMANCE"  # Base model for fine-tuning
tokenizer = MarianTokenizer.from_pretrained(model_name)
model = MarianMTModel.from_pretrained(model_name)

# Add special tokens for Oromo if needed (optional)
# tokenizer.add_tokens(["<om>", "</om>"])
# model.resize_token_embeddings(len(tokenizer))

print(f"Model loaded: {model_name}")
print(f"Tokenizer vocab size: {len(tokenizer)}")

# ✅ 3. Preprocessing function
def preprocess_function(examples, max_length=128):
    """Preprocess the translation examples"""
    # Extract source and target texts
    sources = [ex["en"] for ex in examples["translation"]]
    targets = [ex["om"] for ex in examples["translation"]]
    
    # Tokenize source texts
    model_inputs = tokenizer(
        sources, 
        max_length=max_length, 
        truncation=True, 
        padding="max_length"
    )
    
    # Tokenize target texts
    with tokenizer.as_target_tokenizer():
        labels = tokenizer(
            targets, 
            max_length=max_length, 
            truncation=True, 
            padding="max_length"
        )
    
    # Replace padding token id's in labels with -100 (ignored by loss function)
    labels["input_ids"] = [
        [(l if l != tokenizer.pad_token_id else -100) for l in label] 
        for label in labels["input_ids"]
    ]
    
    model_inputs["labels"] = labels["input_ids"]
    return model_inputs

# Apply preprocessing
print("Preprocessing data...")
tokenized_data = data.map(
    preprocess_function, 
    batched=True, 
    remove_columns=data["train"].column_names
)

print("Data preprocessing completed!")

# ✅ 4. Training arguments
training_args = Seq2SeqTrainingArguments(
    output_dir="./en-om-mt-model",
    eval_strategy="epoch",  # Changed from evaluation_strategy
    learning_rate=3e-5,
    per_device_train_batch_size=4,  # Reduced batch size to avoid memory issues
    per_device_eval_batch_size=4,
    weight_decay=0.01,
    save_total_limit=2,
    num_train_epochs=10,
    predict_with_generate=True,
    logging_dir="./logs",
    logging_steps=50,
    save_strategy="epoch",
    load_best_model_at_end=True,
    metric_for_best_model="eval_loss",
    greater_is_better=False,
    warmup_steps=100,
    fp16=torch.cuda.is_available(),  # Use mixed precision if GPU available
    dataloader_pin_memory=False,
    remove_unused_columns=False,
    report_to=[],  # Disable wandb and other reporting
)

# ✅ 5. Data collator
data_collator = DataCollatorForSeq2Seq(
    tokenizer=tokenizer,
    model=model,
    padding=True
)

# ✅ 6. Initialize trainer
trainer = Seq2SeqTrainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_data["train"],
    eval_dataset=tokenized_data["validation"],
    tokenizer=tokenizer,
    data_collator=data_collator,
)

print("Trainer initialized. Starting training...")

# ✅ 7. Train the model
try:
    trainer.train()
    print("Training completed successfully!")
except Exception as e:
    print(f"Training error: {e}")
    # Save current state even if training fails
    trainer.save_model("./en-om-model-checkpoint")

# ✅ 8. Save the final model
print("Saving model...")
model.save_pretrained("./en-om-model")
tokenizer.save_pretrained("./en-om-model")
print("Model saved successfully!")

# ✅ 9. Test the model with a sample translation
def test_translation(text, model_path="./en-om-model"):
    """Test the trained model with a sample text"""
    try:
        # Load the saved model
        test_tokenizer = MarianTokenizer.from_pretrained(model_path)
        test_model = MarianMTModel.from_pretrained(model_path)
        
        # Tokenize input
        inputs = test_tokenizer(text, return_tensors="pt", padding=True, truncation=True)
        
        # Generate translation
        with torch.no_grad():
            outputs = test_model.generate(**inputs, max_length=128, num_beams=4, early_stopping=True)
        
        # Decode output
        translation = test_tokenizer.decode(outputs[0], skip_special_tokens=True)
        return translation
    except Exception as e:
        print(f"Translation test error: {e}")
        return None

# Test with a sample sentence
sample_text = "Hello, how are you?"
translation = test_translation(sample_text)
if translation:
    print(f"\nSample translation:")
    print(f"English: {sample_text}")
    print(f"Oromo: {translation}")