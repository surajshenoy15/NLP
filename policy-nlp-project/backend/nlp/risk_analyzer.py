def analyze_risk(text):
    text = text.lower()

    if any(word in text for word in ["expulsion", "termination", "legal action"]):
        return "HIGH"

    if any(word in text for word in ["suspension", "penalty", "fine"]):
        return "MEDIUM"

    return "LOW"
