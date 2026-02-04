def generate_reason(doctor, priority="score"):
    reasons = []

    if doctor["rating"] >= 4.5:
        reasons.append("high rating")

    if doctor["distance"] <= 1:
        reasons.append("very close to you")
    elif doctor["distance"] <= 3:
        reasons.append("nearby")

    if doctor.get("open_now"):
        reasons.append("currently open")

    if doctor["user_ratings_total"] >= 100:
        reasons.append("trusted by many patients")

    if not reasons:
        return "Good overall match based on your search"

    return "Because it has " + ", ".join(reasons)
