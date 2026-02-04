def calculate_confidence(doctor, max_distance=5):
    rating_score = doctor["rating"] / 5 if doctor["rating"] else 0

    review_score = min(doctor["user_ratings_total"] / 200, 1)
    dist = doctor["distance"]
    distance_score = max(0, 1 - (dist / max_distance))

    open_score = 1 if doctor.get("open_now") else 0

    confidence = (
        0.4 * rating_score +
        0.25 * review_score +
        0.25 * distance_score +
        0.1 * open_score
    )

    return round(confidence, 2)
