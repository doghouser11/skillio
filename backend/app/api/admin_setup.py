from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.base import get_db
from app.models.models import User, UserRole
from app.core.auth import get_password_hash
from pydantic import BaseModel, EmailStr
import uuid

router = APIRouter(prefix="/admin-setup", tags=["Admin Setup"])


class MasterAdminCreate(BaseModel):
    email: EmailStr
    password: str
    confirm_password: str


@router.post("/create-master-admin")
def create_master_admin(admin_data: MasterAdminCreate, db: Session = Depends(get_db)):
    """
    ONE-TIME SETUP: Create the master admin user.
    This should only be called once during initial setup.
    """
    
    # Security check - only allow creation if no admin exists
    existing_admin = db.query(User).filter(User.role == UserRole.ADMIN).first()
    if existing_admin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Master admin already exists. Cannot create another admin through this endpoint."
        )
    
    # Validate passwords match
    if admin_data.password != admin_data.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match"
        )
    
    # Validate password strength
    if len(admin_data.password) < 12:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 12 characters long for security"
        )
    
    # Only allow the specified master admin email
    if admin_data.email != "nikol_bg_93@proton.me":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the designated master admin email is allowed"
        )
    
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == admin_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    # Create master admin user
    hashed_password = get_password_hash(admin_data.password[:72])
    master_admin = User(
        id=uuid.uuid4(),
        email=admin_data.email,
        password_hash=hashed_password,
        role=UserRole.ADMIN
    )
    
    db.add(master_admin)
    db.commit()
    db.refresh(master_admin)
    
    return {
        "message": "Master admin created successfully",
        "email": master_admin.email,
        "role": master_admin.role.value,
        "created_at": master_admin.created_at
    }


@router.post("/reset-master-password")
def reset_master_admin_password(admin_data: MasterAdminCreate, db: Session = Depends(get_db)):
    """
    SECURITY: Reset master admin password.
    Only works for the designated master admin email.
    """
    
    # Only allow the specified master admin email
    if admin_data.email != "nikol_bg_93@proton.me":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the designated master admin email is allowed"
        )
    
    # Validate passwords match
    if admin_data.password != admin_data.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match"
        )
    
    # Validate password strength
    if len(admin_data.password) < 12:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 12 characters long for security"
        )
    
    # Find and update the master admin
    master_admin = db.query(User).filter(
        User.email == admin_data.email,
        User.role == UserRole.ADMIN
    ).first()
    
    if not master_admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Master admin not found"
        )
    
    # Update password
    master_admin.password_hash = get_password_hash(admin_data.password[:72])
    db.commit()
    
    return {
        "message": "Master admin password updated successfully",
        "email": master_admin.email
    }


@router.get("/status")
def admin_setup_status(db: Session = Depends(get_db)):
    """
    Check if master admin is set up.
    """
    admin_count = db.query(User).filter(User.role == UserRole.ADMIN).count()
    master_admin_exists = db.query(User).filter(
        User.email == "nikol_bg_93@proton.me",
        User.role == UserRole.ADMIN
    ).first() is not None
    
    return {
        "total_admins": admin_count,
        "master_admin_exists": master_admin_exists,
        "setup_complete": master_admin_exists
    }