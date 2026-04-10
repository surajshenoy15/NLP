from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline
import re

from utils.pdf_reader import extract_text_from_pdf
from nlp.clause_splitter import split_into_clauses
from nlp.entity_extractor import extract_entities
from nlp.clause_classifier import classify_clause
from nlp.risk_analyzer import analyze_risk
from nlp.importance_ranker import rank_importance

# -------------------- APP INIT --------------------
app = FastAPI(
    title="Policy Document Understanding System",
    description="AI-powered policy analysis and simplification system",
    version="5.0"
)

# -------------------- CORS --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- MODELS --------------------
summary_model = pipeline(
    "summarization",
    model="sshleifer/distilbart-cnn-12-6"
)

simplifier_model = pipeline(
    "text2text-generation",
    model="google/flan-t5-base"  # MUCH better than t5-small
)

# -------------------- HELPERS --------------------
def clean_text(text: str) -> str:
    text = text.strip()
    if not text.endswith((".", "!", "?")):
        text += "."
    return text


def clean_clause_for_llm(text: str) -> str:
    # Remove numbered headings
    text = re.sub(r'\b\d+\.\s+[A-Z][A-Za-z ]{3,}\b', '', text)

    # Remove common heading words
    text = re.sub(r'\bIntroduction\b', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\bPolicy\b', '', text, flags=re.IGNORECASE)

    # Normalize spaces
    text = re.sub(r'\s+', ' ', text)

    return text.strip()


def semantic_summary(clause: str) -> str:
    text = clause.lower()

    if "penalty" in text or "violation" in text:
        return "Violations may result in penalties or disciplinary action."

    if "attendance" in text:
        return "Students must meet attendance requirements."

    if "misconduct" in text:
        return "Misconduct can lead to disciplinary action."

    if "exam" in text or "examination" in text:
        return "Breaking exam rules can lead to serious consequences."

    return clause.split(",")[0].strip() + "."

# -------------------- ROUTES --------------------
@app.get("/")
def root():
    return {"status": "Policy AI API is running"}


@app.post("/analyze-policy")
async def analyze_policy(file: UploadFile = File(...)):

    text = extract_text_from_pdf(file.file)
    if not text:
        return {"analysis": [], "message": "No text extracted from PDF"}

    clauses = split_into_clauses(text)

    # Limit clauses for demo / extension
    clauses = [
    c for c in clauses if len(c.split()) > 15
]


    results = []

    for clause in clauses:
        word_count = len(clause.split())

        # ---------- SUMMARY ----------
        if word_count < 30:
            summary_text = semantic_summary(clause)
        else:
            summary_output = summary_model(
                clause,
                max_length=max(25, int(word_count * 0.4)),
                min_length=15,
                do_sample=False
            )
            summary_text = clean_text(summary_output[0]["summary_text"])

        # ---------- SIMPLIFIED (PLAIN ENGLISH) ----------
        cleaned_clause = clean_clause_for_llm(clause)

        simplify_prompt = (
            "Explain the following university policy in very simple English.\n"
            "- Do NOT repeat sentences\n"
            "- Do NOT repeat headings\n"
            "- Use short, clear sentences\n"
            "- Explain like talking to a student\n\n"
            f"{cleaned_clause}"
        )

        simplified_output = simplifier_model(
            simplify_prompt,
            max_length=70,
            min_length=30,
            repetition_penalty=2.5,
            no_repeat_ngram_size=3,
            do_sample=False
        )

        simplified_text = clean_text(
            simplified_output[0]["generated_text"]
        )

        # ---------- ANALYTICS ----------
        clause_type = classify_clause(clause)
        risk_level = analyze_risk(clause)
        importance = rank_importance(clause_type, risk_level)
        entities = extract_entities(clause)

        results.append({
            "original_clause": clause,
            "summary": summary_text,
            "simplified": simplified_text,
            "clause_type": clause_type,
            "risk_level": risk_level,
            "importance": importance,
            "entities": entities
        })

    return {
        "processed_clauses": len(results),
        "analysis": results
    }
