from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database.base import get_db

router = APIRouter(prefix="/debug", tags=["Debug"])

@router.get("/raw-schools")
def raw_schools(db: Session = Depends(get_db)):
    """Debug: Raw SQL query for schools"""
    try:
        result = db.execute(text("SELECT id, name, city, verified FROM schools LIMIT 5;")).fetchall()
        return {
            "success": True,
            "count": len(result),
            "schools": [dict(row._mapping) for row in result]
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.get("/raw-activities") 
def raw_activities(db: Session = Depends(get_db)):
    """Debug: Raw SQL query for activities"""
    try:
        result = db.execute(text("SELECT id, title, category, age_min, age_max FROM activities LIMIT 5;")).fetchall()
        return {
            "success": True, 
            "count": len(result),
            "activities": [dict(row._mapping) for row in result]
        }
    except Exception as e:
        return {"success": False, "error": str(e)}