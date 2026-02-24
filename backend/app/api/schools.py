from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
import uuid
from app.database.base import get_db
from app.schemas.schemas import SchoolCreate, SchoolResponse
from app.models.models import School, User, UserRole
from app.core.auth import get_current_user, get_current_school, get_current_admin

router = APIRouter(prefix="/schools", tags=["Schools"])


@router.get("/", response_model=List[SchoolResponse])
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
    return schools


@router.get("/{school_id}", response_model=SchoolResponse)
def get_school(school_id: uuid.UUID, db: Session = Depends(get_db)):
    """Get a specific school."""
    school = db.query(School).filter(School.id == school_id).first()
    if not school:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="School not found"
        )
    return school


@router.post("/", response_model=SchoolResponse)
def create_school(
    school_data: SchoolCreate,
    current_user: User = Depends(get_current_school),
    db: Session = Depends(get_db)
):
    """Create a new school (school users only)."""
    # Check if user already has a school
    existing_school = db.query(School).filter(School.created_by == current_user.id).first()
    if existing_school:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already has a school"
        )
    
    # Create school
    db_school = School(
        name=school_data.name,
        description=school_data.description,
        phone=school_data.phone,
        email=school_data.email,
        city=school_data.city,
        address=school_data.address,
        neighborhood_id=school_data.neighborhood_id,
        lat=school_data.lat,
        lng=school_data.lng,
        created_by=current_user.id
    )
    
    db.add(db_school)
    db.commit()
    db.refresh(db_school)
    
    return db_school


@router.get("/my/school", response_model=SchoolResponse)
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
    return school


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
    
    return school