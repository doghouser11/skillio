#!/usr/bin/env python3
"""
Data seed script for top 10 neighborhoods in Sofia
"""

import asyncio
import sys
import os

# Add the backend directory to Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db_session
from app.models.models import Neighborhood

# Top 10 neighborhoods in Sofia with coordinates
SOFIA_NEIGHBORHOODS = [
    {
        "city": "София",
        "name": "Център",
        "lat": 42.6977,
        "lng": 23.3219
    },
    {
        "city": "София", 
        "name": "Лозенец",
        "lat": 42.6736,
        "lng": 23.3370
    },
    {
        "city": "София",
        "name": "Младост",
        "lat": 42.6491,
        "lng": 23.3816
    },
    {
        "city": "София",
        "name": "Изток", 
        "lat": 42.6734,
        "lng": 23.3536
    },
    {
        "city": "София",
        "name": "Борово",
        "lat": 42.6358,
        "lng": 23.2842
    },
    {
        "city": "София",
        "name": "Студентски град",
        "lat": 42.6589,
        "lng": 23.2964
    },
    {
        "city": "София",
        "name": "Оборище",
        "lat": 42.7069,
        "lng": 23.3342
    },
    {
        "city": "София",
        "name": "Люлин",
        "lat": 42.7075,
        "lng": 23.2553
    },
    {
        "city": "София",
        "name": "Хаджи Димитър",
        "lat": 42.7133,
        "lng": 23.3500
    },
    {
        "city": "София",
        "name": "Витоша",
        "lat": 42.6800,
        "lng": 23.3100
    }
]

async def seed_neighborhoods():
    """Seed the database with Sofia neighborhoods"""
    
    print("🏘️  Starting neighborhood seeding...")
    
    # Get database session 
    async with get_db_session() as db:
        try:
            # Check if neighborhoods already exist
            existing = await db.execute(
                "SELECT COUNT(*) FROM neighborhoods WHERE city = 'София'"
            )
            count = existing.scalar()
            
            if count > 0:
                print(f"⚠️  Found {count} existing Sofia neighborhoods. Skipping seed.")
                return
            
            # Insert neighborhoods
            for neighborhood_data in SOFIA_NEIGHBORHOODS:
                neighborhood = Neighborhood(**neighborhood_data)
                db.add(neighborhood)
                print(f"✅ Added: {neighborhood_data['name']}")
            
            # Commit changes
            await db.commit()
            print(f"🎉 Successfully seeded {len(SOFIA_NEIGHBORHOODS)} neighborhoods!")
            
        except Exception as e:
            await db.rollback()
            print(f"❌ Error seeding neighborhoods: {str(e)}")
            raise

async def main():
    """Main function"""
    try:
        await seed_neighborhoods()
        print("✅ Seeding completed successfully!")
    except Exception as e:
        print(f"❌ Seeding failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())