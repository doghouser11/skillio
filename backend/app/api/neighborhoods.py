from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
from app.database.base import get_db
from app.schemas.schemas import NeighborhoodCreate, NeighborhoodResponse
from app.models.models import Neighborhood, User
from app.core.auth import get_current_admin

router = APIRouter(prefix="/neighborhoods", tags=["Neighborhoods"])


@router.get("/", response_model=List[NeighborhoodResponse])
def get_neighborhoods(
    city: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get all neighborhoods with optional city filter."""
    query = db.query(Neighborhood)
    
    if city:
        query = query.filter(Neighborhood.city.ilike(f"%{city}%"))
    
    neighborhoods = query.all()
    return neighborhoods


@router.get("/{neighborhood_id}", response_model=NeighborhoodResponse)
def get_neighborhood(neighborhood_id: uuid.UUID, db: Session = Depends(get_db)):
    """Get a specific neighborhood."""
    neighborhood = db.query(Neighborhood).filter(Neighborhood.id == neighborhood_id).first()
    if not neighborhood:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Neighborhood not found"
        )
    return neighborhood


@router.post("/", response_model=NeighborhoodResponse)
def create_neighborhood(
    neighborhood_data: NeighborhoodCreate,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Create a new neighborhood (admin only)."""
    # Check if neighborhood already exists
    existing = db.query(Neighborhood).filter(
        Neighborhood.city.ilike(neighborhood_data.city),
        Neighborhood.name.ilike(neighborhood_data.name)
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Neighborhood already exists in this city"
        )
    
    # Create neighborhood
    db_neighborhood = Neighborhood(
        city=neighborhood_data.city,
        name=neighborhood_data.name,
        lat=neighborhood_data.lat,
        lng=neighborhood_data.lng
    )
    
    db.add(db_neighborhood)
    db.commit()
    db.refresh(db_neighborhood)
    
    return db_neighborhood