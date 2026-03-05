from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.base import get_db
from app.models.models import User, School, Activity, Neighborhood, Review, UserRole, SchoolStatus, ActivitySource
import uuid
from datetime import datetime

router = APIRouter(prefix="/dev", tags=["Development"])


@router.post("/seed-test-data")
def seed_test_data(db: Session = Depends(get_db)):
    """Seed database with test data for development/testing"""
    
    try:
        # Check if data already exists
        existing_activities = db.query(Activity).count()
        if existing_activities > 0:
            return {"message": f"Test data already exists ({existing_activities} activities)", "skipped": True}
        
        # Create test neighborhoods
        neighborhoods = [
            {"id": str(uuid.uuid4()), "city": "София", "name": "Център", "lat": 42.6977, "lng": 23.3219},
            {"id": str(uuid.uuid4()), "city": "София", "name": "Лозенец", "lat": 42.6736, "lng": 23.3370},
            {"id": str(uuid.uuid4()), "city": "София", "name": "Младост", "lat": 42.6491, "lng": 23.3816}
        ]
        
        for n_data in neighborhoods:
            neighborhood = Neighborhood(**n_data)
            db.add(neighborhood)
        
        db.flush()  # Get IDs
        
        # Create test users (using string literals to avoid enum issues)
        admin_user = User(
            id=uuid.uuid4(),
            email="admin@skillio.live",
            password_hash="$2b$12$test_hash",
            role="admin"
        )
        school_user = User(
            id=uuid.uuid4(),
            email="school@skillio.live", 
            password_hash="$2b$12$test_hash",
            role="school"
        )
        parent_user = User(
            id=uuid.uuid4(),
            email="parent@skillio.live",
            password_hash="$2b$12$test_hash", 
            role="parent"
        )
        
        db.add_all([admin_user, school_user, parent_user])
        db.flush()
        
        # Create test schools
        schools_data = [
            {
                "name": "Танцово Studio Sofia",
                "description": "Професионално танцово студио за деца и възрастни. Модерни танци, балет, хип-хоп.",
                "phone": "+359888123456",
                "email": "info@dancestudio.bg",
                "website": "https://dancestudio.bg",
                "city": "София",
                "address": "ул. Витоша 15",
                "neighborhood_id": neighborhoods[0]["id"]
            },
            {
                "name": "Футболна Академия Champion", 
                "description": "Детска футболна академия с професионални треньори и модерна база.",
                "phone": "+359888654321",
                "email": "info@champion-academy.bg",
                "website": "https://champion-academy.bg",
                "city": "София",
                "address": "ул. Гео Милев 25",
                "neighborhood_id": neighborhoods[1]["id"]
            },
            {
                "name": "Музикално Училище Harmony",
                "description": "Обучение по пиано, цигулка, китара, пеене. Индивидуални и групови уроци.",
                "phone": "+359888987654",
                "email": "contact@harmony-music.bg", 
                "website": "https://harmony-music.bg",
                "city": "София",
                "address": "бул. Христо Ботев 88",
                "neighborhood_id": neighborhoods[2]["id"]
            }
        ]
        
        schools = []
        for s_data in schools_data:
            school = School(
                **s_data,
                verified=True,
                status="approved",
                created_by=school_user.id
            )
            schools.append(school)
            db.add(school)
        
        db.flush()
        
        # Create test activities
        activities_data = [
            {
                "title": "Модерен танц за деца",
                "description": "Уроци по модерен танц за деца от 4 до 12 години. Развитие на координация, гъвкавост и артистичност.",
                "category": "Танци",
                "age_min": 4,
                "age_max": 12,
                "price_monthly": 80.0,
                "school_id": schools[0].id
            },
            {
                "title": "Балет за начинаещи",
                "description": "Класически балет за деца. Основни позиции, техника и хореография.",
                "category": "Танци", 
                "age_min": 5,
                "age_max": 14,
                "price_monthly": 100.0,
                "school_id": schools[0].id
            },
            {
                "title": "Детски футбол",
                "description": "Обучение по футбол за деца от 6 до 16 години. Техника, тактика, игра в отбор.",
                "category": "Спорт",
                "age_min": 6,
                "age_max": 16, 
                "price_monthly": 60.0,
                "school_id": schools[1].id
            },
            {
                "title": "Уроци по пиано", 
                "description": "Индивидуални уроци по пиано за деца и възрастни. От начинаещи до напреднали.",
                "category": "Музика",
                "age_min": 5,
                "age_max": 18,
                "price_monthly": 120.0,
                "school_id": schools[2].id
            },
            {
                "title": "Детски хор",
                "description": "Групово пеене за деца. Развитие на слуха и музикалността.",
                "category": "Музика",
                "age_min": 6, 
                "age_max": 14,
                "price_monthly": 50.0,
                "school_id": schools[2].id
            },
            {
                "title": "Хип-хоп танци",
                "description": "Съвременни улични танци за деца и тийнейджъри. Энергия и стил.",
                "category": "Танци",
                "age_min": 8,
                "age_max": 18,
                "price_monthly": 90.0,
                "school_id": schools[0].id
            }
        ]
        
        for a_data in activities_data:
            activity = Activity(
                **a_data,
                active=True,
                verified=True,
                created_by=school_user.id,
                source="school"
            )
            db.add(activity)
        
        # Create test reviews
        reviews_data = [
            {"school_id": schools[0].id, "parent_id": parent_user.id, "rating": 5, "comment": "Отлично студио! Децата обичат уроците."},
            {"school_id": schools[1].id, "parent_id": parent_user.id, "rating": 4, "comment": "Добра академия с качествени тренировки."},
            {"school_id": schools[2].id, "parent_id": parent_user.id, "rating": 5, "comment": "Учителите са изключително търпеливи."}
        ]
        
        for r_data in reviews_data:
            review = Review(**r_data)
            db.add(review)
        
        db.commit()
        
        return {
            "message": "Test data seeded successfully!",
            "created": {
                "neighborhoods": len(neighborhoods),
                "schools": len(schools_data), 
                "activities": len(activities_data),
                "reviews": len(reviews_data),
                "users": 3
            }
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Seeding failed: {str(e)}")


@router.delete("/clear-test-data")  
def clear_test_data(db: Session = Depends(get_db)):
    """Clear all test data (DANGER: Use only in development!)"""
    
    try:
        # Delete in reverse order to avoid foreign key issues
        db.query(Review).delete()
        db.query(Activity).delete() 
        db.query(School).delete()
        db.query(User).delete()
        db.query(Neighborhood).delete()
        
        db.commit()
        
        return {"message": "All test data cleared successfully!"}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Clear failed: {str(e)}")


@router.get("/stats")
def get_data_stats(db: Session = Depends(get_db)):
    """Get current data statistics"""
    
    stats = {
        "users": db.query(User).count(),
        "schools": db.query(School).count(),
        "activities": db.query(Activity).count(),
        "reviews": db.query(Review).count(),
        "neighborhoods": db.query(Neighborhood).count()
    }
    
    return stats