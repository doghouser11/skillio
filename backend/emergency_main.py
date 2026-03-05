"""Emergency minimal backend - bypass all issues"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import bcrypt
import jwt
import uuid
from typing import Optional

app = FastAPI(title="Emergency Skillio API")

# CORS - fix the www issue
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://skillio.live",
        "https://www.skillio.live", 
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage (temporary)
users_db = {}
schools_db = [
    {
        "id": "test-school-1",
        "name": "Test Танцово Студио", 
        "city": "София",
        "verified": True,
        "description": "Професионално танцово студио",
        "phone": "+359888123456",
        "email": "info@dancestudio.bg"
    }
]

activities_db = [
    {
        "id": "test-activity-1",
        "title": "Test Танци",
        "category": "Танци", 
        "description": "Уроци по танци за деца от 4-12 години",
        "age_min": 4,
        "age_max": 12,
        "price_monthly": 80.0,
        "active": True,
        "verified": True
    }
]

class UserRegister(BaseModel):
    email: str
    password: str
    role: str

class UserLogin(BaseModel):
    email: str
    password: str

@app.get("/health")
def health():
    return {"status": "healthy", "version": "emergency"}

@app.get("/api/schools")
def get_schools():
    return schools_db

@app.get("/api/activities") 
def get_activities():
    return activities_db

@app.post("/api/auth/register")
def register(user: UserRegister):
    if user.email in users_db:
        raise HTTPException(400, "User already exists")
    
    # Hash password
    password_hash = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt()).decode()
    
    users_db[user.email] = {
        "id": str(uuid.uuid4()),
        "email": user.email,
        "password_hash": password_hash,
        "role": user.role
    }
    
    return {"message": "Registration successful", "email": user.email}

@app.post("/api/auth/login") 
def login(user: UserLogin):
    if user.email not in users_db:
        raise HTTPException(401, "User not found")
    
    stored_user = users_db[user.email]
    
    if not bcrypt.checkpw(user.password.encode(), stored_user["password_hash"].encode()):
        raise HTTPException(401, "Invalid password")
    
    # Create JWT token (simplified)
    token = jwt.encode({
        "sub": stored_user["email"],
        "role": stored_user["role"]
    }, "secret-key", algorithm="HS256")
    
    return {"access_token": token, "token_type": "bearer"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)