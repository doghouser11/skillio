#!/usr/bin/env python3
"""
Data seed script for Sofia neighborhoods and sample activities.
Run this after initial database setup to populate with realistic data.
"""

import sys
import os
import uuid
from datetime import datetime, timedelta
import random

# Add the parent directory to the path so we can import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database.base import Base
from app.models.models import (
    Neighborhood, School, Activity, User, UserRole, 
    ActivitySource, Review
)

# Database URL - adjust as needed
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://admin_skillio:m3TFDKicG40ftJ1zY6rZTQpIbEw3sV9lqVYPwsAJTn1Qa3ujuxx6QeBQqQBy4oaN@localhost:5432/activities_db")

# Sofia neighborhoods data
SOFIA_NEIGHBORHOODS = [
    {"name": "Център", "description": "Исторически център на София с много културни дейности"},
    {"name": "Лозенец", "description": "Престижен жилищен район с отлични училища"},  
    {"name": "Младост 1", "description": "Модерен район с много спортни комплекси"},
    {"name": "Младост 3", "description": "Семеен район с добра инфраструктура"}, 
    {"name": "Студентски град", "description": "Университетски район с образователни центрове"},
    {"name": "Драгалевци", "description": "Спокоен район в подножието на Витоша"},
    {"name": "Борово", "description": "Развиващ се район с нови възможности"},
    {"name": "Банишора", "description": "Традиционен район с богата история"},
    {"name": "Редута", "description": "Зелен район близо до парк Борисова градина"},
    {"name": "Витоша", "description": "Елитен район с изключителни възможности"}
]

# Sample schools data
SAMPLE_SCHOOLS = [
    {
        "name": "Детска академия Монтесори",
        "city": "София", 
        "neighborhood": "Лозенец",
        "description": "Специализирани програми по Монтесори методиката за деца от 3 до 12 години",
        "address": "ул. Г.С. Раковски 125",
        "phone": "02/123-4567",
        "email": "info@montessori-sofia.bg",
        "website": "https://montessori-sofia.bg"
    },
    {
        "name": "SportKids България",
        "city": "София",
        "neighborhood": "Младост 1", 
        "description": "Спортни дейности за деца - футбол, баскетбол, тенис, плуване",
        "address": "бул. Цариградско шосе 87",
        "phone": "02/234-5678", 
        "email": "contact@sportkids.bg",
        "website": "https://sportkids.bg"
    },
    {
        "name": "Арт Студио Дъга",
        "city": "София",
        "neighborhood": "Център",
        "description": "Творчески занимания - рисуване, керамика, музика, театър",
        "address": "ул. Шипка 15",
        "phone": "02/345-6789",
        "email": "hello@artstudio-daga.com"  
    },
    {
        "name": "Роботех Академия",  
        "city": "София",
        "neighborhood": "Студентски град",
        "description": "Програмиране, роботика и STEM образование за деца",
        "address": "бул. Джеймс Баучер 23",
        "phone": "02/456-7890",
        "email": "info@robotech-academy.bg",
        "website": "https://robotech-academy.bg"
    },
    {
        "name": "Английски с Мери Попинс",
        "city": "София", 
        "neighborhood": "Витоша",
        "description": "Изучаване на английски език по fun методики за деца от 4 до 16 години",
        "address": "ул. Околовръстен път 1А",
        "phone": "02/567-8901",
        "email": "mary@english-sofia.com"
    }
]

# Sample activities 
SAMPLE_ACTIVITIES = [
    {
        "title": "Футбол за начинаещи",
        "description": "Обучение по футбол за деца от 5 до 10 години. Професионални треньори, модерно оборудване.",
        "category": "Спорт",
        "age_min": 5,
        "age_max": 10, 
        "price_monthly": 80,
        "school_name": "SportKids България"
    },
    {
        "title": "Програмиране със Scratch",
        "description": "Въведение в програмирането чрез визуален език Scratch. Игрово обучение за деца.",
        "category": "Програмиране", 
        "age_min": 7,
        "age_max": 12,
        "price_monthly": 120,
        "school_name": "Роботех Академия"
    },
    {
        "title": "Рисуване и живопис",
        "description": "Творчески курс по рисуване с различни техники. Развиване на художествени умения.",
        "category": "Изкуство",
        "age_min": 4, 
        "age_max": 14,
        "price_monthly": 60,
        "school_name": "Арт Студио Дъга"
    },
    {
        "title": "Английски за малки", 
        "description": "Изучаване на английски език чрез песни, игри и интерактивни методи.",
        "category": "Езици",
        "age_min": 4,
        "age_max": 8,
        "price_monthly": 100,
        "school_name": "Английски с Мери Попинс" 
    },
    {
        "title": "Тенис за деца",
        "description": "Обучение по тенис на корт. Индивидуален подход към всяко дете.",
        "category": "Спорт", 
        "age_min": 6,
        "age_max": 16,
        "price_monthly": 150,
        "school_name": "SportKids България"
    },
    {
        "title": "Монтесори занимания",
        "description": "Образователни дейности по Монтесори методиката. Развитие на самостоятелност.",
        "category": "Образование",
        "age_min": 3,
        "age_max": 8, 
        "price_monthly": 200,
        "school_name": "Детска академия Монтесори"
    },
    {
        "title": "Роботика с LEGO",
        "description": "Сглобяване и програмиране на роботи с LEGO Mindstorms. Развитие на логическо мислене.",
        "category": "Роботика",
        "age_min": 8,
        "age_max": 15,
        "price_monthly": 140, 
        "school_name": "Роботех Академия"
    },
    {
        "title": "Театрално студио",
        "description": "Развиване на артистични умения, самочувствие и комуникативни способности.",
        "category": "Театър",
        "age_min": 6,
        "age_max": 14,
        "price_monthly": 70,
        "school_name": "Арт Студио Дъга"
    }
]

def create_admin_user(session):
    """Create admin user for system administration"""
    admin_user = User(
        id=str(uuid.uuid4()),
        email="admin@skillio.live",
        password_hash="$2b$12$dummy_hash_for_admin",  # In real app, hash properly
        role=UserRole.ADMIN,
        verified=True,
        created_at=datetime.utcnow()
    )
    session.add(admin_user) 
    return admin_user

def seed_neighborhoods(session):
    """Seed Sofia neighborhoods"""
    print("🏙️  Seeding Sofia neighborhoods...")
    neighborhoods = {}
    
    for n_data in SOFIA_NEIGHBORHOODS:
        neighborhood = Neighborhood(
            id=str(uuid.uuid4()),
            name=n_data["name"],
            city="София", 
            description=n_data["description"],
            created_at=datetime.utcnow()
        )
        session.add(neighborhood)
        neighborhoods[n_data["name"]] = neighborhood
        print(f"   ✅ {n_data['name']}")
    
    return neighborhoods

def seed_schools(session, neighborhoods, admin_user):
    """Seed sample schools"""
    print("🏫 Seeding schools...")
    schools = {}
    
    for s_data in SAMPLE_SCHOOLS:
        neighborhood = neighborhoods.get(s_data["neighborhood"])
        
        school = School(
            id=str(uuid.uuid4()),
            name=s_data["name"],
            city=s_data["city"],
            neighborhood_id=neighborhood.id if neighborhood else None,
            description=s_data["description"],
            address=s_data.get("address"),
            phone=s_data.get("phone"),
            email=s_data.get("email"), 
            website=s_data.get("website"),
            verified=True,
            created_by=admin_user.id,
            created_at=datetime.utcnow()
        )
        session.add(school)
        schools[s_data["name"]] = school
        print(f"   ✅ {s_data['name']} в {s_data['neighborhood']}")
    
    return schools

def seed_activities(session, schools, admin_user):
    """Seed sample activities"""
    print("🎯 Seeding activities...")
    activities = []
    
    for a_data in SAMPLE_ACTIVITIES:
        school = schools.get(a_data["school_name"])
        if not school:
            print(f"   ⚠️  School not found: {a_data['school_name']}")
            continue
            
        activity = Activity(
            id=str(uuid.uuid4()),
            school_id=school.id,
            title=a_data["title"],
            description=a_data["description"],
            category=a_data["category"],
            age_min=a_data["age_min"],
            age_max=a_data["age_max"],
            price_monthly=a_data["price_monthly"],
            source=ActivitySource.SCHOOL,
            verified=True,
            active=True,
            created_by=admin_user.id,
            created_at=datetime.utcnow()
        )
        session.add(activity)
        activities.append(activity) 
        print(f"   ✅ {a_data['title']} ({school.name})")
    
    return activities

def seed_sample_reviews(session, activities, admin_user):
    """Seed some sample reviews"""
    print("⭐ Seeding sample reviews...")
    
    sample_reviews = [
        {"rating": 5, "comment": "Отличен курс! Детето ми много се радва на занятията."},
        {"rating": 4, "comment": "Добри учители, препоръчвам. Малко скъпичко, но си заслужава."},
        {"rating": 5, "comment": "Професионално отношение, виждат се резултатите."},
        {"rating": 4, "comment": "Много добра организация, детето развива умения."},
        {"rating": 5, "comment": "Най-доброто място за този тип дейност в София!"}
    ]
    
    # Add reviews to random activities
    for activity in random.sample(activities, min(5, len(activities))):
        review_data = random.choice(sample_reviews)
        
        review = Review(
            id=str(uuid.uuid4()),
            school_id=activity.school_id,
            activity_id=activity.id,  
            rating=review_data["rating"],
            comment=review_data["comment"],
            reviewer_name="Родител",  # Anonymous for privacy
            verified=True,
            created_by=admin_user.id,
            created_at=datetime.utcnow() - timedelta(days=random.randint(1, 30))
        )
        session.add(review)
        print(f"   ⭐ Review for {activity.title}: {review_data['rating']} stars")

def main():
    print("🌱 Starting Sofia data seeding...")
    
    # Create database connection
    engine = create_engine(DATABASE_URL)
    Base.metadata.create_all(bind=engine)
    
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = SessionLocal()
    
    try:
        # Create admin user
        admin_user = create_admin_user(session)
        
        # Seed data
        neighborhoods = seed_neighborhoods(session)
        schools = seed_schools(session, neighborhoods, admin_user)
        activities = seed_activities(session, schools, admin_user)
        seed_sample_reviews(session, activities, admin_user)
        
        # Commit all changes
        session.commit()
        print("\n✅ Sofia data seeding completed successfully!")
        print(f"📊 Created:")
        print(f"   - {len(SOFIA_NEIGHBORHOODS)} neighborhoods")  
        print(f"   - {len(SAMPLE_SCHOOLS)} schools")
        print(f"   - {len(SAMPLE_ACTIVITIES)} activities")
        print(f"   - ~5 sample reviews")
        print(f"\n🎯 Ready for production at https://skillio-three.vercel.app")
        
    except Exception as e:
        session.rollback()
        print(f"❌ Error during seeding: {e}")
        raise
    finally:
        session.close()

if __name__ == "__main__":
    main()