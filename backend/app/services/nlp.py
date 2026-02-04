import spacy
import re

nlp = spacy.load("en_core_web_sm")

def parse_query(query: str):
    doc = nlp(query.lower())

    budget = None
    for token in doc:
        if token.like_num:
            budget = int(token.text)

    priority = "balanced"
    if "cheap" in query or "lowest" in query:
        priority = "price"
    elif "best" in query:
        priority = "rating"

    return {
        "product": query,
        "budget": budget,
        "priority": priority
    }
