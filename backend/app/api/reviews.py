from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List
import uuid
from app.database.base import get_db
from app.schemas.schemas import ReviewCreate, ReviewResponse
from app.models.models import Review, User, School, UserRole
from app.core.auth import get_current_user, get_current_parent

router = APIRouter(prefix="/reviews", tags=["Reviews"])


@router.post("/", response_model=ReviewResponse)
def create_review(
    review_data: ReviewCreate,
    current_user: User = Depends(get_current_parent),
    db: Session = Depends(get_db)
):
    """Create a new review (parents only)."""
    # Validate rating
    if review_data.rating < 1 or review_data.rating > 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rating must be between 1 and 5"
        )
    
    # Check if school exists
    school = db.query(School).filter(School.id == review_data.school_id).first()
    if not school:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="School not found"
        )
    
    # Check if parent already reviewed this school
    existing_review = db.query(Review).filter(
        and_(
            Review.school_id == review_data.school_id,
            Review.parent_id == current_user.id
        )
    ).first()
    
    if existing_review:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already reviewed this school"
        )
    
    # Create review
    db_review = Review(
        school_id=review_data.school_id,
        parent_id=current_user.id,
        rating=review_data.rating,
        comment=review_data.comment
    )
    
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    
    return db_review


@router.get("/school/{school_id}", response_model=List[ReviewResponse])
def get_school_reviews(school_id: uuid.UUID, db: Session = Depends(get_db)):
    """Get all reviews for a specific school."""
    # Check if school exists
    school = db.query(School).filter(School.id == school_id).first()
    if not school:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="School not found"
        )
    
    reviews = db.query(Review).filter(Review.school_id == school_id).all()
    return reviews


@router.get("/my", response_model=List[ReviewResponse])
def get_my_reviews(
    current_user: User = Depends(get_current_parent),
    db: Session = Depends(get_db)
):
    """Get all reviews created by the current parent."""
    reviews = db.query(Review).filter(Review.parent_id == current_user.id).all()
    return reviews


@router.delete("/{review_id}")
def delete_review(
    review_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a review."""
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found"
        )
    
    # Check permissions
    if current_user.role != UserRole.ADMIN and review.parent_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    db.delete(review)
    db.commit()
    
    return {"message": "Review deleted successfully"}