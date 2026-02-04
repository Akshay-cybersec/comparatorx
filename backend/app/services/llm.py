import requests

OLLAMA_URL = "http://localhost:11434/api/generate"

def summarize_reviews(product_name: str, reviews_text: str):
    prompt = f"""
You are a product analyst.

Summarize user opinions about {product_name}.
Focus on:
- Pros
- Cons
- Camera
- Battery
- Performance
- Value for money

Reviews:
{reviews_text}

Give short bullet points.
"""

    payload = {
        "model": "mistral",
        "prompt": prompt,
        "stream": False,
        "temperature": 0.4,
        "max_tokens": 300
    }

    response = requests.post(OLLAMA_URL, json=payload, timeout=120)
    data = response.json()

    return data["response"]
