from datasets import load_dataset

ds = load_dataset("sentence-transformers/parallel-sentences-jw300", "all", split="train")
# Filter to English–Oromo
ds_enom = [row for row in ds if detect_language(row["non_english"]) == "orm"]
