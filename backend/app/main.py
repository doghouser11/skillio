from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.api import auth, activities, schools, leads, neighborhoods, reviews, admin, dev, migrate, temp_seed, working_seed, debug, simple, emergency, admin_setup
import traceback

app = FastAPI(title="Skillio API", version="1.0.0", redirect_slashes=False)

# CORS — allow everything for now
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Catch all unhandled errors and return CORS-safe response
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},
        headers={"Access-Control-Allow-Origin": "*"},
    )

# Routers
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
    return {"status": "online"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
