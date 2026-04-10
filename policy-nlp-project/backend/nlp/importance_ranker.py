def rank_importance(clause_type, risk_level):
    if clause_type == "PENALTY" or risk_level == "HIGH":
        return "HIGH"

    if clause_type == "OBLIGATION":
        return "MEDIUM"

    return "LOW"
