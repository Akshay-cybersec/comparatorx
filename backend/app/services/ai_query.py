import re

SPECIALITY_SYNONYMS = {
    "dermatologist": ["dermatologist", "derma", "skin", "skin doctor", "skin specialist"],
    "dentist": ["dentist", "dental", "tooth"],
    "cardiologist": ["cardiologist", "heart", "heart doctor"],
    "physician": ["physician", "general doctor", "clinic"],
    "orthopedic": ["orthopedic", "bone", "joint"],
    "gynecologist": ["gynecologist", "gynaecologist", "women doctor"],
    "pediatrician": ["pediatrician", "child doctor", "kids doctor"]
}

INTENT_WORDS = {
    "rating": ["best", "top", "high rated", "good"],
    "distance": ["near", "nearest", "nearby", "close"],
    "reviews": ["popular", "most reviewed"],
    "open_now": ["open now", "currently open"]
}

def detect_speciality(query: str):
    q = query.lower()
    for spec, words in SPECIALITY_SYNONYMS.items():
        for w in words:
            if w in q:
                return spec
    return None

def detect_intent(query: str):
    q = query.lower()
    intent = {
        "sort_by": "score",
        "open_now": False
    }
    for key, words in INTENT_WORDS.items():
        for w in words:
            if w in q:
                if key == "open_now":
                    intent["open_now"] = True
                else:
                    intent["sort_by"] = key
    return intent

def extract_constraints(query: str):
    q = query.lower()
    min_rating = None
    max_distance = None

    rating_match = re.search(r"rating\s*(above|over|>=)?\s*(\d(\.\d)?)", q)
    if rating_match:
        min_rating = float(rating_match.group(2))

    dist_match = re.search(r"(\d+)\s*(km|kilometer|kms)", q)
    if dist_match:
        max_distance = float(dist_match.group(1))

    return min_rating, max_distance

def parse_doctor_query(query: str):
    speciality = detect_speciality(query)
    intent = detect_intent(query)
    min_rating, max_distance = extract_constraints(query)

    return {
        "speciality": speciality,
        "sort_by": intent["sort_by"],
        "open_now": intent["open_now"],
        "min_rating": min_rating,
        "max_distance": max_distance
    }
