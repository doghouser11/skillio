from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
from app.database.base import get_db
from app.schemas.schemas import (
    UserResponse, SchoolResponse, SchoolApproval, 
    ActivityResponse, LeadResponse
)
from app.models.models import (
    User, School, Activity, Lead, Review,
    UserRole, SchoolStatus, LeadStatus
)
from app.core.auth import get_current_admin

router = APIRouter(prefix="/admin", tags=["Admin"])


# Dashboard Statistics
@router.get("/stats")
def get_admin_stats(
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get admin dashboard statistics"""
    
    # Get basic counts
    total_users = db.query(User).count()
    total_parents = db.query(User).filter(User.role == UserRole.PARENT).count()
    total_schools = db.query(User).filter(User.role == UserRole.SCHOOL).count()
    
    # School approval status counts  
    pending_schools = db.query(School).filter(School.status == SchoolStatus.PENDING).count()
    approved_schools = db.query(School).filter(School.status == SchoolStatus.APPROVED).count()
    rejected_schools = db.query(School).filter(School.status == SchoolStatus.REJECTED).count()
    
    # Activity counts
    total_activities = db.query(Activity).filter(Activity.active == True).count()
    verified_activities = db.query(Activity).filter(
        Activity.active == True, 
        Activity.verified == True
    ).count()
    
    # Lead counts
    total_leads = db.query(Lead).count()
    new_leads = db.query(Lead).filter(Lead.status == LeadStatus.NEW).count()
    
    # Recent activity (last 7 days)
    week_ago = datetime.utcnow() - timedelta(days=7)
    new_users_week = db.query(User).filter(User.created_at >= week_ago).count()
    new_schools_week = db.query(School).filter(School.created_at >= week_ago).count()
    new_activities_week = db.query(Activity).filter(Activity.created_at >= week_ago).count()
    
    return {
        "users": {
            "total": total_users,
            "parents": total_parents, 
            "schools": total_schools,
            "new_this_week": new_users_week
        },
        "schools": {
            "total": total_schools,
            "pending": pending_schools,
            "approved": approved_schools,
            "rejected": rejected_schools,
            "new_this_week": new_schools_week
        },
        "activities": {
            "total": total_activities,
            "verified": verified_activities,
            "new_this_week": new_activities_week
        },
        "leads": {
            "total": total_leads,
            "new": new_leads
        }
    }


# User Management
@router.get("/users", response_model=List[UserResponse])
def get_all_users(
    role: Optional[UserRole] = Query(None),
    limit: int = Query(50, le=100),
    offset: int = Query(0, ge=0),
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all users with optional role filtering"""
    query = db.query(User).order_by(desc(User.created_at))
    
    if role:
        query = query.filter(User.role == role)
    
    users = query.offset(offset).limit(limit).all()
    return users


@router.get("/users/{user_id}", response_model=UserResponse)
def get_user_details(
    user_id: uuid.UUID,
    current_admin: User = Depends(get_current_admin), 
    db: Session = Depends(get_db)
):
    """Get detailed user information"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user


# School Approval Management  
@router.get("/schools/pending", response_model=List[SchoolResponse])
def get_pending_schools(
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all schools pending approval"""
    schools = db.query(School).filter(
        School.status == SchoolStatus.PENDING
    ).order_by(School.created_at).all()
    return schools


@router.get("/schools", response_model=List[SchoolResponse])
def get_all_schools(
    status: Optional[SchoolStatus] = Query(None),
    limit: int = Query(50, le=100),
    offset: int = Query(0, ge=0),
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all schools with optional status filtering"""
    query = db.query(School).order_by(desc(School.created_at))
    
    if status:
        query = query.filter(School.status == status)
        
    schools = query.offset(offset).limit(limit).all()
    return schools


@router.put("/schools/{school_id}/approve")
def approve_school(
    school_id: uuid.UUID,
    approval: SchoolApproval,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db) 
):
    """Approve/reject a school"""
    school = db.query(School).filter(School.id == school_id).first()
    if not school:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="School not found"
        )
    
    # Update status
    school.status = approval.status
    
    # If approved, also set legacy verified field
    if approval.status == SchoolStatus.APPROVED:
        school.verified = True
    else:
        school.verified = False
    
    db.commit()
    
    return {
        "message": f"School {approval.status.value} successfully",
        "school_id": school_id,
        "status": approval.status.value,
        "admin_note": approval.admin_note
    }


# Activity Management
@router.get("/activities", response_model=List[ActivityResponse])
def get_all_activities(
    verified: Optional[bool] = Query(None),
    limit: int = Query(50, le=100),
    offset: int = Query(0, ge=0),
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all activities with optional verification filtering"""
    query = db.query(Activity).filter(Activity.active == True).order_by(desc(Activity.created_at))
    
    if verified is not None:
        query = query.filter(Activity.verified == verified)
        
    activities = query.offset(offset).limit(limit).all()
    return activities


@router.put("/activities/{activity_id}/verify")
def verify_activity_admin(
    activity_id: uuid.UUID,
    verified: bool = True,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Verify/unverify an activity (admin only)"""
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity not found"
        )
    
    activity.verified = verified
    db.commit()
    
    return {
        "message": f"Activity {'verified' if verified else 'unverified'} successfully",
        "activity_id": activity_id,
        "verified": verified
    }


# Leads Management
@router.get("/leads", response_model=List[LeadResponse])
def get_all_leads(
    status: Optional[LeadStatus] = Query(None),
    limit: int = Query(50, le=100),
    offset: int = Query(0, ge=0),
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all leads with optional status filtering"""
    query = db.query(Lead).order_by(desc(Lead.created_at))
    
    if status:
        query = query.filter(Lead.status == status)
        
    leads = query.offset(offset).limit(limit).all()
    return leads