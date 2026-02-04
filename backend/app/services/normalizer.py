def normalize_data(raw_data):
    normalized = []

    for item in raw_data:
        price = float(item["price"].replace("₹", "").replace(",", ""))
        rating = float(item["rating"])

        normalized.append({
            "name": item["name"],
            "price": price,
            "rating": rating,
            "seller": item["seller"],
            "url": item["url"]
        })

    return normalized
