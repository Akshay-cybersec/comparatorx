def normalize_data(raw_data):
    normalized = []

    for item in raw_data:
        try:
            price = float(item["price"].replace("₹", "").replace(",", ""))
            rating = float(item["rating"])

            normalized.append({
                "name": item["name"],
                "price": price,
                "rating": rating,
                "seller": item["seller"],
                "url": item["url"]
            })
        except:
            continue

    return normalized

def normalize_doctors(raw_data):
    normalized = []

    for d in raw_data:
        normalized.append({
            "name": d.get("name"),
            "rating": d.get("rating", 0),
            "user_ratings_total": d.get("user_ratings_total", 0),
            "address": d.get("vicinity"),
            "location": d["geometry"]["location"]
        })

    return normalized

