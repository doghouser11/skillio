from fastapi import APIRouter
from app.database.base import get_db
from sqlalchemy.orm import Session
from fastapi import Depends

router = APIRouter(prefix="/simple", tags=["Simple"])

@router.get("/test")
def simple_test():
    """Ultra-simple test endpoint"""
    return {"status": "simple_ok", "message": "Backend is alive!"}

@router.get("/schools-basic")
def schools_basic(db: Session = Depends(get_db)):
    """Bypass ORM - raw SQL for schools"""
    try:
        result = db.execute("SELECT name, city FROM schools LIMIT 5;").fetchall()
        return [{"name": row[0], "city": row[1]} for row in result]
    except Exception as e:
        return {"error": str(e), "message": "Database connection issue"}