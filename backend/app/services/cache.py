import time

# In-memory cache
CACHE = {}
TTL = 300  # 5 minutes

def get_cache(key: str):
    if key in CACHE:
        timestamp, data = CACHE[key]
        if time.time() - timestamp < TTL:
            return data
        else:
            # expired
            del CACHE[key]
    return None

def set_cache(key: str, data):
    CACHE[key] = (time.time(), data)
