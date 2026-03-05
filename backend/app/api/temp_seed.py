from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database.base import get_db

router = APIRouter(prefix="/temp", tags=["Temporary"])

@router.post("/quick-seed")
def quick_seed(db: Session = Depends(get_db)):
    """Quick seed with raw SQL to bypass enum issues"""
    
    try:
        # Execute raw SQL
        sql = """
        INSERT INTO users (id, email, password_hash, role, created_at) VALUES 
        ('11111111-1111-1111-1111-111111111111'::uuid, 'admin@test.bg', '$2b$12$test_hash', 'admin', NOW()),
        ('22222222-2222-2222-2222-222222222222'::uuid, 'school@test.bg', '$2b$12$test_hash', 'school', NOW())
        ON CONFLICT (email) DO NOTHING;
        
        INSERT INTO neighborhoods (id, city, name, lat, lng) VALUES 
        ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'София', 'Център', 42.6977, 23.3219)
        ON CONFLICT (id) DO NOTHING;
        
        INSERT INTO schools (id, name, description, phone, email, city, address, neighborhood_id, verified, status, created_by, created_at) VALUES 
        ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid, 'Test Танцово Студио', 'Test описание', '+359888123456', 'info@test.bg', 'София', 'ул. Test 1', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, true, 'APPROVED', '22222222-2222-2222-2222-222222222222'::uuid, NOW())
        ON CONFLICT (id) DO NOTHING;
        
        INSERT INTO activities (id, school_id, title, description, category, age_min, age_max, price_monthly, active, verified, created_by, source, created_at) VALUES 
        ('cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid, 'Test Танци', 'Test уроци по танци.', 'Танци', 4, 12, 50.00, true, true, '22222222-2222-2222-2222-222222222222'::uuid, 'school', NOW())
        ON CONFLICT (id) DO NOTHING;
        """
        
        db.execute(text(sql))
        db.commit()
        
        return {
            "success": True,
            "message": "Quick test data created!",
            "accounts": [
                "admin@test.bg (role: admin)",  
                "school@test.bg (role: school)"
            ],
            "note": "Password hashes are fake - need real bcrypt for login"
        }
        
    except Exception as e:
        db.rollback()
        return {"success": False, "error": str(e)}