#!/usr/bin/env python3
"""
Seed script to populate the database with initial data for testing.
Run after database migrations are applied.
"""

import asyncio
import sys
import os

# Add the project root to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from sqlalchemy.orm import Session
from app.database.base import SessionLocal
from app.models.models import User, Neighborhood, School, Activity, UserRole, ActivitySource
from app.core.auth import get_password_hash


def seed_data():
    """Seed the database with initial test data."""
    db: Session = SessionLocal()
    
    try:
        print("🌱 Seeding database with initial data...")
        
        # Create neighborhoods
        neighborhoods_data = [
            {"city": "Sofia", "name": "Center", "lat": 42.6977, "lng": 23.3219},
            {"city": "Sofia", "name": "Lozenets", "lat": 42.6735, "lng": 23.3370},
            {"city": "Sofia", "name": "Mladost", "lat": 42.6497, "lng": 23.3833},
            {"city": "Plovdiv", "name": "Center", "lat": 42.1354, "lng": 24.7453},
            {"city": "Plovdiv", "name": "Karshiyaka", "lat": 42.1522, "lng": 24.7533},
            {"city": "Varna", "name": "Center", "lat": 43.2141, "lng": 27.9147},
            {"city": "Varna", "name": "Seaside", "lat": 43.2069, "lng": 27.9203},
        ]
        
        neighborhoods = []
        for data in neighborhoods_data:
            neighborhood = Neighborhood(**data)
            db.add(neighborhood)
            neighborhoods.append(neighborhood)
        
        db.commit()
        print(f"✅ Created {len(neighborhoods)} neighborhoods")
        
        # Create admin user
        admin_user = User(
            email="admin@activities.com",
            password_hash=get_password_hash("admin123"),
            role=UserRole.ADMIN
        )
        db.add(admin_user)
        
        # Create test school user
        school_user = User(
            email="school@test.com",
            password_hash=get_password_hash("school123"),
            role=UserRole.SCHOOL
        )
        db.add(school_user)
        
        # Create test parent user
        parent_user = User(
            email="parent@test.com",
            password_hash=get_password_hash("parent123"),
            role=UserRole.PARENT
        )
        db.add(parent_user)
        
        db.commit()
        print("✅ Created test users (admin, school, parent)")
        
        # Create test school
        test_school = School(
            name="Sofia Kids Academy",
            description="Premier children's activity center in Sofia",
            phone="+359 2 123 4567",
            email="info@sofiakids.com",
            city="Sofia",
            address="123 Main Street",
            neighborhood_id=neighborhoods[0].id,  # Sofia Center
            lat=42.6977,
            lng=23.3219,
            verified=True,
            created_by=school_user.id
        )
        db.add(test_school)
        db.commit()
        print("✅ Created test school")
        
        # Create test activities
        activities_data = [
            {
                "title": "Kids Soccer Training",
                "description": "Professional soccer training for children ages 6-12",
                "category": "Sports",
                "age_min": 6,
                "age_max": 12,
                "price_monthly": 120.0,
                "school_id": test_school.id,
                "verified": True,
                "created_by": school_user.id,
                "source": ActivitySource.SCHOOL
            },
            {
                "title": "Art & Crafts Workshop",
                "description": "Creative art classes to develop imagination and fine motor skills",
                "category": "Arts & Crafts",
                "age_min": 4,
                "age_max": 10,
                "price_monthly": 80.0,
                "school_id": test_school.id,
                "verified": True,
                "created_by": school_user.id,
                "source": ActivitySource.SCHOOL
            },
            {
                "title": "Piano Lessons for Beginners",
                "description": "Individual piano lessons for children starting their musical journey",
                "category": "Music",
                "age_min": 5,
                "age_max": 15,
                "price_monthly": 200.0,
                "school_id": test_school.id,
                "verified": True,
                "created_by": school_user.id,
                "source": ActivitySource.SCHOOL
            },
            {
                "title": "Coding for Kids",
                "description": "Introduction to programming with Scratch and Python",
                "category": "STEM",
                "age_min": 8,
                "age_max": 14,
                "price_monthly": 150.0,
                "school_id": None,  # Parent suggestion
                "verified": False,
                "created_by": parent_user.id,
                "source": ActivitySource.PARENT
            }
        ]
        
        for data in activities_data:
            activity = Activity(**data)
            db.add(activity)
        
        db.commit()
        print(f"✅ Created {len(activities_data)} test activities")
        
        print("\n🎉 Database seeded successfully!")
        print("\nTest accounts created:")
        print("👤 Admin: admin@activities.com / admin123")
        print("🏫 School: school@test.com / school123")
        print("👨‍👩‍👧‍👦 Parent: parent@test.com / parent123")
        print("\n🚀 You can now start the application!")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_data()