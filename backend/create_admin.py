#!/usr/bin/env python3
"""Create admin user with password admin123456"""

import os
import sys
import uuid
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import bcrypt

# Add the app directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.models.models import User, UserRole
from app.database.base import Base

# Database URL from env or default
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:YOnWXWdCRPRG3dQQ@db.hulqbgfllkxjfnmgjupq.supabase.co:5432/postgres")

def create_admin():
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # Check if admin already exists
        existing_admin = db.query(User).filter(
            User.email == "nikol_bg_93@proton.me", 
            User.role == UserRole.ADMIN
        ).first()
        
        if existing_admin:
            # Update password
            password = "admin123456"
            pwd_bytes = password.encode('utf-8')
            salt = bcrypt.gensalt()
            hashed_password = bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')
            
            existing_admin.password_hash = hashed_password
            db.commit()
            print("✅ Admin password updated to: admin123456")
        else:
            # Create new admin
            password = "admin123456"
            pwd_bytes = password.encode('utf-8')
            salt = bcrypt.gensalt()
            hashed_password = bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')
            
            admin_user = User(
                id=uuid.uuid4(),
                email="nikol_bg_93@proton.me",
                password_hash=hashed_password,
                role=UserRole.ADMIN
            )
            
            db.add(admin_user)
            db.commit()
            print("✅ Admin user created: nikol_bg_93@proton.me / admin123456")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()