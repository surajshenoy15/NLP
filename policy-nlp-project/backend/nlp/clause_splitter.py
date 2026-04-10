import re

def split_into_clauses(text: str):
    # Normalize spacing
    text = re.sub(r'\s+', ' ', text)

    # Remove numbered headings like "1. Introduction"
    text = re.sub(r'\b\d+\.\s+[A-Z][A-Za-z ]{3,}\b', '', text)

    # Split into sentences
    sentences = re.split(r'(?<=[.!?])\s+', text)

    clauses = []
    for s in sentences:
        s = s.strip()

        # Skip very short or heading-like text
        if len(s.split()) < 15:
            continue

        # Skip pure headings
        if s.isupper():
            continue

        clauses.append(s)

    return clauses
