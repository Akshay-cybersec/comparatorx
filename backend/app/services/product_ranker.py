def rank_products(products):
    for p in products:
        p["score"] = (100000 / p["price"]) + (p["rating"] * 10)
    return sorted(products, key=lambda x: x["score"], reverse=True)
