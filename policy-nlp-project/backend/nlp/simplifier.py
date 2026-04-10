from transformers import pipeline

simplifier = pipeline(
    "text2text-generation",
    model="t5-small"
)

def simplify_text(text):
    output = simplifier(
    "simplify in English: " + text,
    max_length=80
)

    return output[0]["generated_text"]
