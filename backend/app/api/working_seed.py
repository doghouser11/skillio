from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database.base import get_db

router = APIRouter(prefix="/fix", tags=["Fix"])

@router.post("/working-seed")
def working_seed(db: Session = Depends(get_db)):
    """Working seed with proper foreign key relationships"""
    
    try:
        # Clear existing data first
        db.execute(text("DELETE FROM activities;"))
        db.execute(text("DELETE FROM schools;"))
        db.execute(text("DELETE FROM neighborhoods;"))  
        db.execute(text("DELETE FROM users;"))
        db.commit()
        
        # Step 1: Create users with consistent UUIDs
        db.execute(text("""
        INSERT INTO users (id, email, password_hash, role, created_at) VALUES 
        ('00000000-0000-0000-0000-000000000001'::uuid, 'admin@test.bg', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LTgp3KMNM6kx7Tc2C', 'admin', NOW()),
        ('00000000-0000-0000-0000-000000000002'::uuid, 'school@test.bg', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LTgp3KMNM6kx7Tc2C', 'school', NOW());
        """))
        
        # Step 2: Create neighborhoods
        db.execute(text("""
        INSERT INTO neighborhoods (id, city, name, lat, lng) VALUES 
        ('00000000-0000-0000-0000-000000000100'::uuid, 'София', 'Център', 42.6977, 23.3219);
        """))
        
        # Step 3: Create schools (referencing existing user and neighborhood)
        db.execute(text("""
        INSERT INTO schools (id, name, description, phone, email, city, address, neighborhood_id, verified, status, created_by, created_at) VALUES 
        ('00000000-0000-0000-0000-000000000200'::uuid, 
         'Танцово Studio Sofia', 
         'Професионално танцово студио за деца и възрастни. Модерни танци, балет, хип-хоп.',
         '+359888123456', 
         'info@dancestudio.bg', 
         'София', 
         'ул. Витоша 15', 
         '00000000-0000-0000-0000-000000000100'::uuid, 
         true, 
         'APPROVED', 
         '00000000-0000-0000-0000-000000000002'::uuid, 
         NOW());
        """))
        
        # Step 4: Create activities (referencing existing school and user)
        db.execute(text("""
        INSERT INTO activities (id, school_id, title, description, category, age_min, age_max, price_monthly, active, verified, created_by, source, created_at) VALUES 
        ('00000000-0000-0000-0000-000000000300'::uuid,
         '00000000-0000-0000-0000-000000000200'::uuid,
         'Модерен танц за деца',
         'Уроци по модерен танц за деца от 4 до 12 години. Развитие на координация, гъвкавост и артистичност.',
         'Танци',
         4,
         12,
         80.00,
         true,
         true,
         '00000000-0000-0000-0000-000000000002'::uuid,
         'school',
         NOW());
        """))
        
        db.commit()
        
        # Verify data was created
        users_count = db.execute(text("SELECT COUNT(*) FROM users;")).scalar()
        schools_count = db.execute(text("SELECT COUNT(*) FROM schools;")).scalar()
        activities_count = db.execute(text("SELECT COUNT(*) FROM activities;")).scalar()
        
        return {
            "success": True,
            "message": "Working seed completed!",
            "created": {
                "users": users_count,
                "schools": schools_count,  
                "activities": activities_count
            },
            "test_accounts": [
                "admin@test.bg (password: test123)",
                "school@test.bg (password: test123)"
            ]
        }
        
    except Exception as e:
        db.rollback()
        return {
            "success": False,
            "error": str(e),
            "note": "Check Coolify logs for detailed SQL errors"
        }