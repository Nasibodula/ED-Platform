import PyPDF2
import pandas as pd
import re
import json

def extract_text_from_pdf(pdf_path):
    """Extract text from PDF file"""
    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
        return text
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return None

def clean_and_parse_text(text):
    """Clean and parse the extracted text into dictionary format"""
    # Split into lines and clean
    lines = text.split('\n')
    cleaned_lines = []
    
    for line in lines:
        line = line.strip()
        if line and len(line) > 5:  # Filter out very short lines
            cleaned_lines.append(line)
    
    return cleaned_lines

def parse_dictionary_entries(lines):
    """Parse lines into dictionary entries matching your backend format"""
    entries = []
    
    for line in lines:
        # Try different patterns based on common dictionary formats
        patterns = [
            # Pattern 1: word type - english word - borana word
            r'(.+?)\s+(n\.|v\.|adj\.|adv\.)\s*-\s*(.+)',
            # Pattern 2: english word (type) - borana word  
            r'(.+?)\s*\((n\.|v\.|adj\.|adv\.)\)\s*-\s*(.+)',
            # Pattern 3: english word - borana word (no type)
            r'(.+?)\s*-\s*(.+)',
            # Pattern 4: english word : borana word
            r'(.+?)\s*:\s*(.+)',
        ]
        
        parsed = False
        for pattern in patterns:
            match = re.match(pattern, line, re.IGNORECASE)
            if match:
                if len(match.groups()) == 3:
                    # Has word type
                    english_part = match.group(1).strip()
                    word_type = match.group(2).strip()
                    borana_part = match.group(3).strip()
                else:
                    # No word type
                    english_part = match.group(1).strip()
                    borana_part = match.group(2).strip()
                    word_type = ""
                
                # Convert word type abbreviations
                type_mapping = {
                    'n.': 'noun',
                    'v.': 'verb', 
                    'adj.': 'adjective',
                    'adv.': 'adverb'
                }
                word_type = type_mapping.get(word_type, word_type)
                
                # Handle multiple borana translations (separated by semicolons or commas)
                borana_translations = re.split('[;,]', borana_part)
                
                for borana in borana_translations:
                    borana = borana.strip()
                    if borana:
                        entry_line = f"{english_part}"
                        if word_type:
                            entry_line += f" {word_type.replace('noun', 'n.-').replace('verb', 'v.-').replace('adjective', 'adj.-').replace('adverb', 'adv.-')}"
                        entry_line += f" {borana}"
                        entries.append(entry_line)
                
                parsed = True
                break
        
        if not parsed and '-' in line:
            # Fallback: simple split by dash
            parts = line.split('-', 1)
            if len(parts) == 2:
                english_part = parts[0].strip()
                borana_part = parts[1].strip()
                entries.append(f"{english_part} - {borana_part}")
    
    return entries

def convert_to_backend_format(entries):
    """Convert entries to the format expected by your backend"""
    formatted_data = []
    
    for entry in entries:
        formatted_data.append(f"        {entry}")
    
    return '\n'.join(formatted_data)

def main():
    # Replace with your actual PDF file path
    pdf_path = "english_borana.pdf"
    
    print("Extracting text from PDF...")
    text = extract_text_from_pdf(pdf_path)
    
    if text is None:
        print("Failed to extract text from PDF")
        return
    
    print("Cleaning and parsing text...")
    lines = clean_and_parse_text(text)
    
    print(f"Found {len(lines)} lines to process")
    
    print("Parsing dictionary entries...")
    entries = parse_dictionary_entries(lines)
    
    print(f"Parsed {len(entries)} dictionary entries")
    
    # Convert to backend format
    backend_data = convert_to_backend_format(entries)
    
    # Save to file
    with open('extracted_dictionary.txt', 'w', encoding='utf-8') as f:
        f.write(backend_data)
    
    print("Dictionary data saved to 'extracted_dictionary.txt'")
    print("\nFirst 10 entries:")
    for i, entry in enumerate(entries[:10]):
        print(f"  {i+1}. {entry}")
    
    # Also save as JSON for easier inspection
    with open('dictionary_entries.json', 'w', encoding='utf-8') as f:
        json.dump(entries, f, indent=2, ensure_ascii=False)
    
    print("\nEntries also saved as JSON in 'dictionary_entries.json'")

if __name__ == "__main__":
    main()