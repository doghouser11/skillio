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