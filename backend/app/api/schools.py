from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, func, desc, or_
from typing import List, Optional
import uuid
from app.database.base import get_db
from app.schemas.schemas import SchoolCreate, SchoolResponse
from app.models.models import School, User, UserRole, SchoolStatus, Review
from app.core.auth import get_current_user, get_current_school, get_current_admin

router = APIRouter(prefix="/schools", tags=["Schools"])


def school_to_dict(s):
    return {
        "id": str(s.id), "name": s.name, "category": getattr(s, 'category', None),
        "description": s.description,
        "phone": s.phone, "email": s.email, "website": s.website,
        "city": s.city, "address": s.address, "neighborhood": getattr(s, 'neighborhood', None),
        "lat": s.lat, "lng": s.lng, "verified": s.verified,
        "status": s.status.value if s.status else "PENDING",
        "created_by": str(s.created_by) if s.created_by else None,
        "created_at": str(s.created_at) if s.created_at else None,
    }


@router.get("/featured", )
def get_featured_schools(
    limit: int = Query(6, le=20),
    db: Session = Depends(get_db)
):
    """Get top-rated approved schools for homepage display."""
    
    try:
        # Get schools (prefer verified/approved ones)
        query = db.query(School).filter(
            or_(
                School.verified == True,  # Legacy verified field
                School.status == 'APPROVED'  # New status field
            )
        ).order_by(
            desc(School.verified),
            desc(School.created_at)
        ).limit(limit)
        
        schools = query.all()
        
        # Set default rating values for response
        for school in schools:
            school.average_rating = None
            school.review_count = 0
        
        return [school_to_dict(s) for s in schools]
        
    except Exception as e:
        # Fallback: return any schools if filtering fails
        print(f"Featured schools error: {e}")
        schools = db.query(School).order_by(desc(School.created_at)).limit(limit).all()
        
        for school in schools:
            school.average_rating = None 
            school.review_count = 0
            
        return [school_to_dict(s) for s in schools]


@router.get("/", )
def get_schools(
    city: Optional[str] = Query(None),
    neighborhood_id: Optional[uuid.UUID] = Query(None),
    verified_only: bool = Query(False),
    db: Session = Depends(get_db)
):
    """Get all schools with optional filters."""
    query = db.query(School)
    
    # Apply filters
    if city:
        query = query.filter(School.city.ilike(f"%{city}%"))
    
    if neighborhood_id:
        query = query.filter(School.neighborhood_id == neighborhood_id)
    
    if verified_only:
        query = query.filter(School.verified == True)
    
    schools = query.all()
    return [school_to_dict(s) for s in schools]


@router.get("/{school_id}", )
def get_school(school_id: uuid.UUID, db: Session = Depends(get_db)):
    """Get a specific school."""
    school = db.query(School).filter(School.id == school_id).first()
    if not school:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="School not found"
        )
    return school_to_dict(school)


@router.post("/")
def create_school(
    school_data: SchoolCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new school/teacher/org (any logged-in user)."""
    
    # Check for duplicate by name + city
    existing = db.query(School).filter(
        func.lower(School.name) == school_data.name.lower().strip(),
        func.lower(School.city) == school_data.city.lower().strip()
    ).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"Организация с име '{existing.name}' в {existing.city} вече съществува"
        )
    
    db_school = School(
        name=school_data.name,
        category=school_data.category,
        description=school_data.description,
        phone=school_data.phone,
        email=school_data.email,
        website=school_data.website,
        city=school_data.city,
        address=school_data.address,
        neighborhood=school_data.neighborhood,
        lat=school_data.lat,
        lng=school_data.lng,
        created_by=current_user.id,
        verified=False,
    )
    db.add(db_school)
    db.commit()
    db.refresh(db_school)
    
    return {"id": str(db_school.id), "name": db_school.name, "city": db_school.city, "status": "pending"}


@router.get("/my/school", )
def get_my_school(
    current_user: User = Depends(get_current_school),
    db: Session = Depends(get_db)
):
    """Get the current user's school."""
    school = db.query(School).filter(School.created_by == current_user.id).first()
    if not school:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="School not found"
        )
    return school_to_dict(school)


@router.put("/{school_id}/verify")
def verify_school(
    school_id: uuid.UUID,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Verify a school (admin only)."""
    school = db.query(School).filter(School.id == school_id).first()
    if not school:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="School not found"
        )
    
    school.verified = True
    db.commit()
    
    return {"message": "School verified successfully"}


@router.put("/{school_id}")
def update_school(
    school_id: uuid.UUID,
    school_data: SchoolCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a school."""
    school = db.query(School).filter(School.id == school_id).first()
    if not school:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="School not found"
        )
    
    # Check permissions
    if current_user.role != UserRole.ADMIN and school.created_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # Update school
    for field, value in school_data.dict().items():
        setattr(school, field, value)
    
    db.commit()
    db.refresh(school)
    
    return school_to_dict(school)