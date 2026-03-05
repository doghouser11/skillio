from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import bcrypt
import jwt
import uuid

router = APIRouter(prefix="/emergency", tags=["Emergency"])

class EmergencyRegister(BaseModel):
    email: str
    password: str
    role: str

class EmergencyLogin(BaseModel):
    email: str
    password: str

# In-memory user storage (temporary)
emergency_users = {}

@router.get("/schools")
def emergency_schools():
    """Emergency schools endpoint - no database required"""
    return [
        {
            "id": "emergency-school-1",
            "name": "Test Танцово Студио",
            "city": "София",
            "verified": True,
            "description": "Професионално танцово студио за деца",
            "phone": "+359888123456",
            "email": "info@dancestudio.bg",
            "website": "https://dancestudio.bg"
        }
    ]

@router.get("/activities")
def emergency_activities():
    """Emergency activities endpoint - no database required"""
    return [
        {
            "id": "emergency-activity-1",
            "title": "Модерен танц за деца",
            "category": "Танци",
            "description": "Уроци по модерен танц за деца от 4 до 12 години",
            "age_min": 4,
            "age_max": 12,
            "price_monthly": 80.0,
            "active": True,
            "verified": True,
            "school": {
                "name": "Test Танцово Студио",
                "city": "София"
            }
        }
    ]

@router.post("/register")
def emergency_register(user: EmergencyRegister):
    """Emergency registration - no database required"""
    if user.email in emergency_users:
        raise HTTPException(400, detail="User already exists")
    
    password_hash = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt()).decode()
    
    emergency_users[user.email] = {
        "id": str(uuid.uuid4()),
        "email": user.email,
        "password_hash": password_hash,
        "role": user.role
    }
    
    return {"message": "Registration successful", "email": user.email}

@router.post("/login")
def emergency_login(user: EmergencyLogin):
    """Emergency login - no database required"""
    if user.email not in emergency_users:
        raise HTTPException(401, detail="User not found")
    
    stored_user = emergency_users[user.email]
    
    if not bcrypt.checkpw(user.password.encode(), stored_user["password_hash"].encode()):
        raise HTTPException(401, detail="Invalid password")
    
    token = jwt.encode({
        "sub": stored_user["email"],
        "role": stored_user["role"]
    }, "emergency-secret", algorithm="HS256")
    
    return {"access_token": token, "token_type": "bearer"}