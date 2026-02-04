from pydantic import BaseModel

class Product(BaseModel):
    name: str
    price: float
    rating: float
    seller: str
    url: str
