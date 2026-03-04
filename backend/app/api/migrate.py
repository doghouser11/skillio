from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database.base import get_db

router = APIRouter(prefix="/migrate", tags=["Migration"])


@router.post("/add-missing-columns")
def add_missing_columns(db: Session = Depends(get_db)):
    """Add missing columns to database tables - EMERGENCY FIX"""
    
    try:
        # List of SQL commands to add missing columns
        migrations = [
            "ALTER TABLE schools ADD COLUMN IF NOT EXISTS website text;",
            "ALTER TABLE schools ADD COLUMN IF NOT EXISTS status text DEFAULT 'APPROVED';", 
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS refresh_token text;",
            "UPDATE schools SET status = 'APPROVED' WHERE status IS NULL;"
        ]
        
        results = []
        for sql in migrations:
            try:
                db.execute(text(sql))
                results.append({"sql": sql, "status": "success"})
            except Exception as e:
                results.append({"sql": sql, "status": "error", "error": str(e)})
        
        db.commit()
        
        return {
            "message": "Database migration completed!",
            "results": results
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Migration failed: {str(e)}")


@router.get("/check-schema")  
def check_schema(fix: bool = False, db: Session = Depends(get_db)):
    """Check current database schema and optionally fix missing columns"""
    
    try:
        # Check schools table columns
        schools_columns = db.execute(text("""
            SELECT column_name, data_type, is_nullable, column_default 
            FROM information_schema.columns 
            WHERE table_name = 'schools'
            ORDER BY ordinal_position;
        """)).fetchall()
        
        # Check users table columns  
        users_columns = db.execute(text("""
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns
            WHERE table_name = 'users' 
            ORDER BY ordinal_position;
        """)).fetchall()
        
        schools_cols = [row[0] for row in schools_columns]
        users_cols = [row[0] for row in users_columns]
        
        # Check what's missing
        missing = {
            "schools_missing_website": "website" not in schools_cols,
            "schools_missing_status": "status" not in schools_cols, 
            "users_missing_refresh_token": "refresh_token" not in users_cols
        }
        
        # If fix=true, add missing columns
        fixes_applied = []
        if fix:
            if missing["schools_missing_website"]:
                db.execute(text("ALTER TABLE schools ADD COLUMN website text;"))
                fixes_applied.append("Added schools.website")
                
            if missing["schools_missing_status"]:
                db.execute(text("ALTER TABLE schools ADD COLUMN status text DEFAULT 'APPROVED';"))
                db.execute(text("UPDATE schools SET status = 'APPROVED' WHERE status IS NULL;"))
                fixes_applied.append("Added schools.status")
                
            if missing["users_missing_refresh_token"]:
                db.execute(text("ALTER TABLE users ADD COLUMN refresh_token text;"))
                fixes_applied.append("Added users.refresh_token")
            
            if fixes_applied:
                db.commit()
        
        return {
            "schools_columns": [dict(row._mapping) for row in schools_columns],
            "users_columns": [dict(row._mapping) for row in users_columns],
            "missing": missing,
            "fixes_applied": fixes_applied if fix else None
        }
        
    except Exception as e:
        if fix:
            db.rollback()
        raise HTTPException(status_code=500, detail=f"Schema check failed: {str(e)}")