from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List
import uuid
from app.database.base import get_db
from app.schemas.schemas import LeadCreate, LeadResponse, LeadUpdateStatus
from app.models.models import Lead, User, Activity, School, UserRole
from app.core.auth import get_current_user, get_current_parent, get_current_school

router = APIRouter(prefix="/leads", tags=["Leads"])


@router.post("/", response_model=LeadResponse)
def create_lead(
    lead_data: LeadCreate,
    current_user: User = Depends(get_current_parent),
    db: Session = Depends(get_db)
):
    """Create a new lead (parents only)."""
    # Check if activity exists
    activity = db.query(Activity).filter(Activity.id == lead_data.activity_id).first()
    if not activity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity not found"
        )
    
    # Check if lead already exists for this parent-activity pair
    existing_lead = db.query(Lead).filter(
        and_(
            Lead.activity_id == lead_data.activity_id,
            Lead.parent_id == current_user.id
        )
    ).first()
    
    if existing_lead:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Lead already exists for this activity"
        )
    
    # Create lead
    db_lead = Lead(
        activity_id=lead_data.activity_id,
        parent_id=current_user.id,
        child_age=lead_data.child_age,
        message=lead_data.message
    )
    
    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)
    
    return db_lead


@router.get("/my", response_model=List[LeadResponse])
def get_my_leads(
    current_user: User = Depends(get_current_parent),
    db: Session = Depends(get_db)
):
    """Get all leads created by the current parent."""
    leads = db.query(Lead).filter(Lead.parent_id == current_user.id).all()
    return leads


@router.get("/school", response_model=List[LeadResponse])
def get_school_leads(
    current_user: User = Depends(get_current_school),
    db: Session = Depends(get_db)
):
    """Get all leads for the current school's activities."""
    # Get school
    school = db.query(School).filter(School.created_by == current_user.id).first()
    if not school:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="School not found"
        )
    
    # Get leads for school activities
    leads = (
        db.query(Lead)
        .join(Activity)
        .filter(Activity.school_id == school.id)
        .all()
    )
    
    return leads


@router.put("/{lead_id}/status", response_model=LeadResponse)
def update_lead_status(
    lead_id: uuid.UUID,
    status_data: LeadUpdateStatus,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update lead status."""
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found"
        )
    
    # Check permissions
    if current_user.role == UserRole.SCHOOL:
        # School can update leads for their activities
        school = db.query(School).filter(School.created_by == current_user.id).first()
        if not school or lead.activity.school_id != school.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions"
            )
    elif current_user.role == UserRole.PARENT:
        # Parents can only view, not update status
        if lead.parent_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions"
            )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Parents cannot update lead status"
        )
    elif current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # Update status
    lead.status = status_data.status
    db.commit()
    db.refresh(lead)
    
    return lead


@router.get("/{lead_id}", response_model=LeadResponse)
def get_lead(
    lead_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific lead."""
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found"
        )
    
    # Check permissions
    if current_user.role == UserRole.PARENT and lead.parent_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    elif current_user.role == UserRole.SCHOOL:
        school = db.query(School).filter(School.created_by == current_user.id).first()
        if not school or lead.activity.school_id != school.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions"
            )
    elif current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    return lead