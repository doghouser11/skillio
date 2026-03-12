from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List
import uuid
from app.database.base import get_db
from app.models.models import Inquiry, InquiryStatus, School, User
from app.schemas.schemas import InquiryCreate, InquiryResponse
from app.core.auth import get_current_user, get_current_admin

router = APIRouter(prefix="/inquiries", tags=["Inquiries"])


@router.post("/")
def create_inquiry(data: InquiryCreate, db: Session = Depends(get_db)):
    """Public endpoint — no auth required. Creates a new inquiry for a school."""
    school = db.query(School).filter(School.id == data.school_id).first()
    if not school:
        raise HTTPException(status_code=404, detail="Организацията не е намерена")

    inquiry = Inquiry(
        school_id=data.school_id,
        parent_name=data.parent_name,
        parent_email=data.parent_email,
        parent_phone=data.parent_phone,
        child_age=data.child_age,
        message=data.message,
        status=InquiryStatus.NEW,
    )
    db.add(inquiry)
    db.commit()
    db.refresh(inquiry)

    return {"success": True, "id": str(inquiry.id), "message": "Запитването е изпратено успешно"}


@router.get("/school/{school_id}")
def get_school_inquiries(
    school_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get inquiries for a school. Requires auth (school owner or admin)."""
    school = db.query(School).filter(School.id == school_id).first()
    if not school:
        raise HTTPException(status_code=404, detail="School not found")

    if str(current_user.role) != "admin" and school.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    inquiries = (
        db.query(Inquiry)
        .filter(Inquiry.school_id == school_id)
        .order_by(desc(Inquiry.created_at))
        .all()
    )
    return [
        {
            "id": str(i.id),
            "school_id": str(i.school_id),
            "parent_name": i.parent_name,
            "parent_email": i.parent_email,
            "parent_phone": i.parent_phone,
            "child_age": i.child_age,
            "message": i.message,
            "status": i.status.value if i.status else "NEW",
            "created_at": str(i.created_at) if i.created_at else None,
        }
        for i in inquiries
    ]


@router.get("/admin")
def get_all_inquiries(
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Admin only — get all inquiries."""
    inquiries = db.query(Inquiry).order_by(desc(Inquiry.created_at)).all()
    return [
        {
            "id": str(i.id),
            "school_id": str(i.school_id),
            "parent_name": i.parent_name,
            "parent_email": i.parent_email,
            "parent_phone": i.parent_phone,
            "child_age": i.child_age,
            "message": i.message,
            "status": i.status.value if i.status else "NEW",
            "created_at": str(i.created_at) if i.created_at else None,
        }
        for i in inquiries
    ]
