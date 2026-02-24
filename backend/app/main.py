from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, activities, schools, leads, neighborhoods, reviews

# Create FastAPI app
app = FastAPI(
    title="Children Activities Marketplace",
    description="MVP platform for children extracurricular activities",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
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


@app.get("/")
def root():
    """Root endpoint."""
    return {"message": "Children Activities Marketplace API"}


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}