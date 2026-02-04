def normalize_products(raw):
    normalized = []

    for p in raw:
        try:
            price = float(p["price"].replace("₹", "").replace(",", ""))
            normalized.append({
                "name": p["name"],
                "price": price,
                "rating": float(p.get("rating", 0)),
                "seller": p["seller"],
                "url": p["url"]
            })
        except:
            continue

    return normalized
