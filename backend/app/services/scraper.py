import requests
from bs4 import BeautifulSoup

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
    "Accept-Language": "en-IN,en;q=0.9",
}

def scrape_amazon(query: str):
    url = f"https://www.amazon.in/s?k={query.replace(' ', '+')}"
    res = requests.get(url, headers=HEADERS, timeout=15)

    if res.status_code != 200:
        return []

    soup = BeautifulSoup(res.text, "lxml")
    results = []

    items = soup.select(".s-result-item")

    for item in items[:5]:
        try:
            title = item.select_one("h2 span")
            price = item.select_one(".a-price-whole")
            rating = item.select_one(".a-icon-alt")

            if not title or not price:
                continue

            results.append({
                "name": title.text.strip(),
                "price": f"₹{price.text.replace(',', '')}",
                "rating": rating.text.split()[0] if rating else "0",
                "seller": "Amazon",
                "url": "https://amazon.in" + item.h2.a["href"]
            })
        except:
            continue

    return results


def scrape_flipkart(query: str):
    url = f"https://www.flipkart.com/search?q={query.replace(' ', '%20')}"
    res = requests.get(url, headers=HEADERS, timeout=15)

    if res.status_code != 200:
        return []

    soup = BeautifulSoup(res.text, "lxml")
    results = []

    items = soup.select("._1AtVbE")

    for item in items[:5]:
        try:
            title = item.select_one("._4rR01T")
            price = item.select_one("._30jeq3")
            rating = item.select_one("._3LWZlK")

            if not title or not price:
                continue

            results.append({
                "name": title.text.strip(),
                "price": f"₹{price.text.replace('₹','').replace(',','')}",
                "rating": rating.text if rating else "0",
                "seller": "Flipkart",
                "url": "https://flipkart.com"
            })
        except:
            continue

    return results
