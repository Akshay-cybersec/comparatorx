import math

def rank_products(products, priority="balanced"):
    for p in products:
        if priority == "price":
            p["score"] = 100000 / p["price"]
        elif priority == "rating":
            p["score"] = p["rating"] * 20
        else:
            p["score"] = (100000 / p["price"]) + (p["rating"] * 10)

    return sorted(products, key=lambda x: x["score"], reverse=True)


def distance(lat1, lon1, lat2, lon2):
    return math.sqrt((lat1-lat2)**2 + (lon1-lon2)**2)

def rank_doctors(doctors, user_lat, user_lng):
    for d in doctors:
        dist = distance(user_lat, user_lng,
                        d["location"]["lat"],
                        d["location"]["lng"])
        d["distance"] = round(dist, 3)
        d["score"] = (d["rating"] * 10) + (1 / (dist + 0.01))

    return sorted(doctors, key=lambda x: x["score"], reverse=True)
