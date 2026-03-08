from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import PlainTextResponse
from app.api import auth, activities, schools, leads, neighborhoods, reviews, admin, dev, migrate, temp_seed, working_seed, debug, simple, emergency, admin_setup

# Create FastAPI app
app = FastAPI(
    title="Children Activities Marketplace",
    description="MVP platform for children extracurricular activities",
    version="1.0.0"
)

# ===== CORS — FIRST MIDDLEWARE =====
ALLOWED_ORIGINS = [
    "https://www.skillio.live",
    "https://skillio.live",
    "https://skillio-three.vercel.app",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Fallback: ensures CORS headers even on 500 errors (where CORSMiddleware won't fire)
@app.middleware("http")
async def cors_on_error(request: Request, call_next):
    origin = request.headers.get("origin", "")
    if request.method == "OPTIONS" and origin in ALLOWED_ORIGINS:
        return PlainTextResponse("OK", headers={
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials": "true",
        })
    response = await call_next(request)
    if origin in ALLOWED_ORIGINS and "access-control-allow-origin" not in response.headers:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
    return response

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
app.include_router(emergency.router, prefix="/api")
app.include_router(admin_setup.router, prefix="/api")


@app.get("/")
def root():
    """Root endpoint."""
    return {"message": "Children Activities Marketplace API"}


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}