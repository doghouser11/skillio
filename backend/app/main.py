from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, activities, schools, leads, neighborhoods, reviews, admin, dev, migrate, temp_seed, working_seed, debug, simple

# Create FastAPI app
app = FastAPI(
    title="Children Activities Marketplace",
    description="MVP platform for children extracurricular activities",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",           # Development
        "https://skillio-three.vercel.app", # Production Vercel
        "https://skillio.live",            # Production custom domain
        "https://www.skillio.live",        # Production with www
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(activities.router, prefix="/api")
app.include_router(schools.router, prefix="/api")
app.include_router(leads.router, prefix="/api")
app.include_router(neighborhoods.router, prefix="/api")
app.include_router(reviews.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
app.include_router(dev.router, prefix="/api")
app.include_router(migrate.router, prefix="/api")
app.include_router(temp_seed.router, prefix="/api")
app.include_router(working_seed.router, prefix="/api")
app.include_router(debug.router, prefix="/api")
app.include_router(simple.router, prefix="/api")


@app.get("/")
def root():
    """Root endpoint."""
    return {"message": "Children Activities Marketplace API"}


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


# Emergency endpoints - bypass DB for basic functionality
@app.get("/api/emergency/schools")
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

@app.get("/api/emergency/activities")
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

# Emergency auth endpoints
from fastapi import HTTPException
from pydantic import BaseModel
import bcrypt
import jwt
import uuid

class EmergencyRegister(BaseModel):
    email: str
    password: str
    role: str

class EmergencyLogin(BaseModel):
    email: str
    password: str

# In-memory user storage (temporary)
emergency_users = {}

@app.post("/api/emergency/register")
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

@app.post("/api/emergency/login")
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