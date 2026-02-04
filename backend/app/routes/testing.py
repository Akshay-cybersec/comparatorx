from fastapi import APIRouter

router = APIRouter()

@router.get("/testing")
def testingroute():
    
    return {
        "working": True
    }
