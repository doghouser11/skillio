from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
import uuid
from app.database.base import get_db
from app.schemas.schemas import ActivityCreate, ActivityResponse
from app.models.models import Activity, User, School, Neighborhood, UserRole, ActivitySource
from app.core.auth import get_current_user, get_current_parent, get_current_school, get_current_admin

router = APIRouter(prefix="/activities", tags=["Activities"])


@router.get("/", response_model=List[ActivityResponse])
def get_activities(
    city: Optional[str] = Query(None),
    neighborhood_id: Optional[uuid.UUID] = Query(None),
    category: Optional[str] = Query(None),
    age_min: Optional[int] = Query(None),
    age_max: Optional[int] = Query(None),
    price_min: Optional[float] = Query(None),
    price_max: Optional[float] = Query(None),
    include_unverified: bool = Query(False),
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all activities with optional filters. Only verified activities and schools shown by default."""
    query = db.query(Activity).filter(Activity.active == True)
    
    # Only show verified activities from verified schools for public listings
    if not include_unverified or (current_user and current_user.role != UserRole.ADMIN):
        query = query.filter(Activity.verified == True)
        query = query.join(School, Activity.school_id == School.id, isouter=True)
        query = query.filter(
            and_(
                Activity.school_id.is_(None),  # Parent submissions
                School.verified == True  # Or verified schools
            ).or_(Activity.school_id.is_(None))
        )
    
    # Apply filters
    if city:
        query = query.join(School, Activity.school_id == School.id, isouter=True)
        query = query.filter(School.city.ilike(f"%{city}%"))
    
    if neighborhood_id:
        query = query.join(School, Activity.school_id == School.id, isouter=True)
        query = query.filter(School.neighborhood_id == neighborhood_id)
    
    if category:
        query = query.filter(Activity.category.ilike(f"%{category}%"))
    
    if age_min is not None:
        query = query.filter(Activity.age_max >= age_min)
    
    if age_max is not None:
        query = query.filter(Activity.age_min <= age_max)
        
    if price_min is not None:
        query = query.filter(Activity.price_monthly >= price_min)
        
    if price_max is not None:
        query = query.filter(Activity.price_monthly <= price_max)
    
    activities = query.all()
    return activities


@router.get("/{activity_id}", response_model=ActivityResponse)
def get_activity(activity_id: uuid.UUID, db: Session = Depends(get_db)):
    """Get a specific activity."""
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity not found"
        )
    return activity


@router.post("/", response_model=ActivityResponse)
def create_activity(
    activity_data: ActivityCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new activity."""
    # Validate school ownership for school users
    if current_user.role == UserRole.SCHOOL and activity_data.school_id:
        school = db.query(School).filter(
            and_(
                School.id == activity_data.school_id,
                School.created_by == current_user.id
            )
        ).first()
        if not school:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Can only create activities for your own school"
            )
    
    # Parent submissions must not have school_id
    if current_user.role == UserRole.PARENT and activity_data.school_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Parent submissions cannot specify a school"
        )
    
    # Create activity
    db_activity = Activity(
        school_id=activity_data.school_id,
        title=activity_data.title,
        description=activity_data.description,
        category=activity_data.category,
        age_min=activity_data.age_min,
        age_max=activity_data.age_max,
        price_monthly=activity_data.price_monthly,
        created_by=current_user.id,
        source=activity_data.source,
        verified=current_user.role == UserRole.SCHOOL  # Auto-verify school activities
    )
    
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    
    return db_activity


@router.put("/{activity_id}/verify")
def verify_activity(
    activity_id: uuid.UUID,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Verify an activity (admin only)."""
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity not found"
        )
    
    activity.verified = True
    db.commit()
    
    return {"message": "Activity verified successfully"}


@router.delete("/{activity_id}")
def delete_activity(
    activity_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete/deactivate an activity."""
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity not found"
        )
    
    # Check permissions
    if current_user.role != UserRole.ADMIN and activity.created_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    activity.active = False
    db.commit()
    
    return {"message": "Activity deactivated successfully"}