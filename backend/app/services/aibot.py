import re
from typing import Any, Dict, Optional, Tuple
from urllib.parse import urlparse

from difflib import get_close_matches
from transformers import pipeline

ALLOWED_INTENTS = {
    "product_search",
    "price_compare",
    "product_recommendation",
    "general_query",
}


ZERO_SHOT_LABELS = [
    "product_search",
    "price_compare",
    "product_recommendation",
    "general_query",
]


COLORS = {
    "black",
    "white",
    "red",
    "blue",
    "green",
    "yellow",
    "pink",
    "purple",
    "orange",
    "brown",
    "gray",
    "grey",
    "beige",
    "cyan",
    "navy",
    "maroon",
    "olive",
    "teal",
}

COLOR_SYNONYMS = {
    "cyan": "blue",
    "navy": "blue",
    "teal": "blue",
    "maroon": "red",
    "grey": "gray",
}

COLOR_HARMONY = {
    "cyan": ["navy blue", "black", "charcoal grey", "white"],
    "blue": ["black", "white", "gray", "tan"],
    "red": ["black", "white", "navy blue", "gray"],
    "green": ["white", "black", "beige", "navy blue"],
}

PRODUCT_KEYWORDS = [
    # apparel
    "jeans",
    "t-shirt",
    "shirt",
    "shoes",
    "sneakers",
    "hoodie",
    "jacket",
    "dress",
    "skirt",
    "shorts",
    "trousers",
    "pants",
    "sunglasses",
    "glasses",
    "sandals",
    "boots",
    # electronics
    "phone",
    "smartphone",
    "laptop",
    "tablet",
    "headphones",
    "earbuds",
    "watch",
    "camera",
    "speaker",
    # home & kitchen
    "cake",
    "mixer",
    "blender",
    "microwave",
    "air fryer",
    "toaster",
    "kettle",
    # misc
    "backpack",
    "bottle",
    "perfume",
    "book",
]

PRODUCT_KEYWORDS_SET = set(PRODUCT_KEYWORDS)

PRODUCT_SYNONYMS = {
    "jeans": "denim",
    "t-shirt": "tee",
    "sunglasses": "shades",
    "phone": "mobile",
}

BRANDS = {
    "nike",
    "adidas",
    "puma",
    "reebok",
    "apple",
    "samsung",
    "oneplus",
    "xiaomi",
    "levi's",
    "levis",
    "h&m",
    "zara",
}


GENDERS = {
    "men": "men",
    "mens": "men",
    "male": "men",
    "women": "women",
    "womens": "women",
    "female": "women",
    "kids": "kids",
    "kid": "kids",
    "boys": "kids",
    "boy": "kids",
    "girls": "kids",
    "girl": "kids",
}


ECOMMERCE_DOMAINS = {
    "amazon.com",
    "amazon.in",
    "walmart.com",
    "target.com",
    "bestbuy.com",
    "flipkart.com",
    "myntra.com",
    "ajio.com",
    "snapdeal.com",
    "nike.com",
    "adidas.com",
    "apple.com",
    "samsung.com",
}


BLOCKED_DOMAIN_KEYWORDS = {
    "pinterest",
    "blog",
    "blogspot",
    "medium",
    "wordpress",
    "tumblr",
    "reddit",
    "quora",
    "youtube",
    "facebook",
    "instagram",
    "tiktok",
}


SIZE_PATTERN = re.compile(r"\b(\d{2,3}|xs|s|m|l|xl|xxl|xxxl)\b", re.IGNORECASE)
AGE_PATTERN = re.compile(r"\b(\d{1,2}\s*-\s*\d{1,2}|\d{1,2})\s*(?:years|yrs|yr|year)\s*old?\b", re.IGNORECASE)
_ZERO_SHOT = None
KEYWORD_INTENTS = {
    "product_search": [
        "buy",
        "find",
        "looking for",
        "want",
        "purchase",
        "order",
    ],
    "price_compare": [
        "compare",
        "cheapest",
        "price difference",
        "lowest price",
        "best price",
    ],
    "product_recommendation": [
        "best for",
        "matching",
        "goes with",
        "match with",
        "pair with",
    ],
}


def extract_intent_entities(message: str) -> Dict[str, Any]:
    text = (message or "").lower()
    intent, ai_confidence = _detect_intent_with_confidence(text)
    keyword_intent, keyword_confidence = _keyword_intent_confidence(text)
    if keyword_intent:
        if keyword_confidence > ai_confidence:
            intent = keyword_intent
    confidence = (0.7 * ai_confidence) + (0.3 * keyword_confidence)

    entities = {
        "product": _extract_product(text),
        "size": _extract_size(text),
        "color": _extract_color(text),
        "brand": _extract_brand(text),
        "gender": _extract_gender(text),
        "match_with": _extract_match_with(text),
    }

    return {"intent": intent, "confidence": confidence, "entities": entities}


def _detect_intent_with_confidence(text: str) -> Tuple[str, float]:
    global _ZERO_SHOT
    if _ZERO_SHOT is None:
        _ZERO_SHOT = pipeline(
            "zero-shot-classification",
            model="facebook/bart-large-mnli",
        )
    result = _ZERO_SHOT(text, ZERO_SHOT_LABELS, multi_label=False)
    labels = result.get("labels", [])
    scores = result.get("scores", [])
    if not labels or not scores:
        return "general_query", 0.0
    top_label = labels[0]
    top_score = float(scores[0])
    if top_label not in ALLOWED_INTENTS:
        return "general_query", top_score
    return top_label, top_score


def _extract_product(text: str) -> Optional[str]:
    for product in sorted(PRODUCT_KEYWORDS, key=len, reverse=True):
        if product in text:
            return product
    phrase = _extract_product_phrase(text)
    if phrase:
        return phrase
    return _fuzzy_match(text, PRODUCT_KEYWORDS_SET)


def _extract_size(text: str) -> Optional[str]:
    age_match = AGE_PATTERN.search(text)
    if age_match:
        age = re.sub(r"\s+", "", age_match.group(1))
        return f"age {age} years"
    match = SIZE_PATTERN.search(text)
    if match:
        value = match.group(1).upper()
        if value.isdigit():
            return f"waist {value}"
        return value
    return None


def _extract_color(text: str) -> Optional[str]:
    for color in COLORS:
        if re.search(rf"\b{re.escape(color)}\b", text):
            return COLOR_SYNONYMS.get(color, color)
    fuzzy = _fuzzy_match(text, COLORS)
    if fuzzy:
        return COLOR_SYNONYMS.get(fuzzy, fuzzy)
    return None


def _extract_brand(text: str) -> Optional[str]:
    for brand in BRANDS:
        if re.search(rf"\b{re.escape(brand)}\b", text):
            return brand
    return _fuzzy_match(text, BRANDS)
    return None


def _extract_gender(text: str) -> Optional[str]:
    for key, value in GENDERS.items():
        if re.search(rf"\b{re.escape(key)}\b", text):
            return value
    return None


def _extract_match_with(text: str) -> Optional[Dict[str, Optional[str]]]:
    pattern = r"(?:match with|matching|goes with|pair with)\s+([a-z\s]+)"
    match = re.search(pattern, text)
    if not match:
        return None
    phrase = match.group(1).strip()
    product = None
    color = None
    for prod in sorted(PRODUCT_KEYWORDS, key=len, reverse=True):
        if prod in phrase:
            product = prod
            break
    for col in COLORS:
        if re.search(rf"\b{re.escape(col)}\b", phrase):
            color = COLOR_SYNONYMS.get(col, col)
            break
    return {"product": product, "color": color}


def _extract_product_phrase(text: str) -> Optional[str]:
    patterns = [
        r"(?:looking for|find|buy|want|purchase|order)\s+([a-z0-9\-\s]{2,50})",
        r"(?:need|search for)\s+([a-z0-9\-\s]{2,50})",
    ]
    for pattern in patterns:
        match = re.search(pattern, text)
        if not match:
            continue
        phrase = match.group(1).strip()
        phrase = re.split(r"\b(size|color|colour|price|under|below|for|that)\b", phrase)[0].strip()
        phrase = re.sub(r"\s+", " ", phrase)
        return phrase or None
    return None


def normalize_extraction(raw: Dict[str, Any]) -> Tuple[str, float, Dict[str, Any]]:
    intent = raw.get("intent") if isinstance(raw, dict) else None
    if intent not in ALLOWED_INTENTS:
        intent = "general_query"

    confidence = raw.get("confidence") if isinstance(raw, dict) else None
    if confidence is None:
        confidence = 0.0
    try:
        confidence = float(confidence)
    except Exception:
        confidence = 0.0

    entities = raw.get("entities") if isinstance(raw, dict) else None
    if not isinstance(entities, dict):
        entities = {}

    match_with = entities.get("match_with")
    if match_with is not None and not isinstance(match_with, dict):
        match_with = None

    normalized = {
        "product": _normalize_str(entities.get("product")),
        "size": _normalize_str(entities.get("size")),
        "color": _normalize_str(entities.get("color")),
        "brand": _normalize_str(entities.get("brand")),
        "gender": _normalize_str(entities.get("gender")),
        "match_with": None,
    }

    if match_with is not None:
        normalized["match_with"] = {
            "product": _normalize_str(match_with.get("product")),
            "color": _normalize_str(match_with.get("color")),
        }

    return intent, confidence, normalized


def _keyword_intent_confidence(text: str) -> Tuple[Optional[str], float]:
    best_intent = None
    best_score = 0.0
    for intent, keywords in KEYWORD_INTENTS.items():
        hits = sum(1 for kw in keywords if kw in text)
        if hits:
            score = min(1.0, hits / max(1, len(keywords)))
            if score > best_score:
                best_score = score
                best_intent = intent
    return best_intent, best_score


def _normalize_str(value: Any) -> Optional[str]:
    if value is None:
        return None
    value = str(value).strip()
    return value or None


def required_follow_up(intent: str, entities: Dict[str, Any]) -> Optional[str]:
    if intent in {"product_search", "price_compare", "product_recommendation"}:
        if not entities.get("product"):
            return "What product are you looking for?"
    return None


def build_query(intent: str, entities: Dict[str, Any], fallback: str) -> str:
    parts = []
    if entities.get("gender"):
        parts.append(entities["gender"])
    if entities.get("brand"):
        parts.append(entities["brand"])
    if entities.get("product"):
        parts.append(entities["product"])
    if entities.get("size"):
        parts.append(f"size {entities['size']}")
    if entities.get("color"):
        parts.append(entities["color"])

    match_with = entities.get("match_with") or None
    if isinstance(match_with, dict):
        mw_product = match_with.get("product")
        mw_color = match_with.get("color")
        if mw_product or mw_color:
            mw_parts = " ".join([p for p in [mw_color, mw_product] if p])
            parts.append(f"best match for {mw_parts}".strip())

    if intent == "price_compare":
        parts.append("price")
        parts.append("buy online")
    if intent == "product_recommendation":
        parts.append("best")
        parts.append("buy online")
    if intent == "product_search":
        parts.append("buy online")

    query = " ".join([p for p in parts if p]).strip()
    return query or fallback


def build_query_variants(intent: str, entities: Dict[str, Any], fallback: str) -> list:
    base = build_query(intent, entities, fallback=fallback)
    variants = [base]

    expanded_parts = []
    product = entities.get("product")
    if product in PRODUCT_SYNONYMS:
        expanded_parts.append(PRODUCT_SYNONYMS[product])
    color = entities.get("color")
    if intent == "product_recommendation" and color:
        harmonies = COLOR_HARMONY.get(color, [])
        if harmonies:
            expanded_parts.append("colors " + " ".join(harmonies[:2]))
    if expanded_parts:
        variants.append(base + " " + " ".join(expanded_parts))

    fallback_query = " ".join([p for p in [entities.get("brand"), entities.get("product")] if p]).strip()
    if fallback_query:
        variants.append(fallback_query)

    deduped = []
    for q in variants:
        if q and q not in deduped:
            deduped.append(q)
    return deduped


def filter_and_rank_results(items: list, entities: Dict[str, Any]) -> list:
    filtered = []
    for item in items:
        link = item.get("link") or ""
        domain = _extract_domain(link)
        if _is_blocked_domain(domain):
            continue
        filtered.append({
            "title": item.get("title"),
            "link": link,
            "snippet": item.get("snippet"),
            "image": None,
            "_domain": domain,
        })

    def score(entry: Dict[str, Any]) -> int:
        base = 0
        if entry.get("_domain") in ECOMMERCE_DOMAINS:
            base += 6
        text = f"{entry.get('title') or ''} {entry.get('snippet') or ''}".lower()
        intent_boost = 0
        if "price" in text:
            intent_boost += 1
        base += intent_boost
        for key in ["product", "brand", "color", "size", "gender"]:
            value = entities.get(key)
            if value and str(value).lower() in text:
                base += 2
        match_with = entities.get("match_with") or {}
        if isinstance(match_with, dict):
            for key in ["product", "color"]:
                value = match_with.get(key)
                if value and str(value).lower() in text:
                    base += 1
        return base

    ranked = sorted(filtered, key=score, reverse=True)
    for entry in ranked:
        entry.pop("_domain", None)
    return ranked


def _extract_domain(link: str) -> str:
    try:
        parsed = urlparse(link)
        return parsed.netloc.lower().replace("www.", "")
    except Exception:
        return ""


def _is_blocked_domain(domain: str) -> bool:
    if not domain:
        return False
    return any(keyword in domain for keyword in BLOCKED_DOMAIN_KEYWORDS)


def _fuzzy_match(text: str, options: set) -> Optional[str]:
    tokens = re.findall(r"[a-z0-9']+", text.lower())
    for token in tokens:
        match = get_close_matches(token, options, n=1, cutoff=0.88)
        if match:
            return match[0]
    return None
