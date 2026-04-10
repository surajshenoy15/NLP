def classify_clause(text):
    text = text.lower()

    if any(word in text for word in ["shall", "must", "required"]):
        return "OBLIGATION"

    if any(word in text for word in ["penalty", "suspension", "expulsion", "disciplinary"]):
        return "PENALTY"

    if any(word in text for word in ["may", "can", "subject to"]):
        return "RULE"

    return "INFORMATION"
