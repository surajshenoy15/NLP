from transformers import pipeline

summarizer = pipeline(
    "summarization",
    model="facebook/bart-large-cnn"
)

def summarize_clause(text):
    summary = summarizer(
        text,
        max_length=60,
        min_length=20,
        do_sample=False
    )
    return summary[0]["summary_text"]
