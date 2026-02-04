from app.services.scraper import scrape_amazon
from app.services.flipkart_scraper import scrape_flipkart

def fetch_from_sources(query: str, category: str):
    data = []

    try:
        data += scrape_amazon(query)
    except:
        pass

    try:
        data += scrape_flipkart(query)
    except:
        pass

    return data
