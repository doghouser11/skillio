from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
import uuid
from app.models.models import UserRole, ActivitySource, LeadStatus


# User schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: UserRole


class UserResponse(BaseModel):
    id: uuid.UUID
    email: str
    role: UserRole
    created_at: datetime
    
    class Config:
        from_attributes = True


# Auth schemas
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# Neighborhood schemas
class NeighborhoodCreate(BaseModel):
    city: str
    name: str
    lat: float
    lng: float


class NeighborhoodResponse(BaseModel):
    id: uuid.UUID
    city: str
    name: str
    lat: float
    lng: float
    
    class Config:
        from_attributes = True


# School schemas
class SchoolCreate(BaseModel):
    name: str
    description: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    city: str
    address: Optional[str] = None
    neighborhood_id: Optional[uuid.UUID] = None
    lat: Optional[float] = None
    lng: Optional[float] = None


class SchoolResponse(BaseModel):
    id: uuid.UUID
    name: str
    description: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    city: str
    address: Optional[str] = None
    neighborhood_id: Optional[uuid.UUID] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    verified: bool
    created_by: uuid.UUID
    created_at: datetime
    neighborhood: Optional[NeighborhoodResponse] = None
    
    class Config:
        from_attributes = True


# Activity schemas
class ActivityCreate(BaseModel):
    school_id: Optional[uuid.UUID] = None
    title: str
    description: Optional[str] = None
    category: str
    age_min: int
    age_max: int
    price_monthly: Optional[float] = None
    source: ActivitySource


class ActivityResponse(BaseModel):
    id: uuid.UUID
    school_id: Optional[uuid.UUID] = None
    title: str
    description: Optional[str] = None
    category: str
    age_min: int
    age_max: int
    price_monthly: Optional[float] = None
    active: bool
    verified: bool
    created_by: uuid.UUID
    source: ActivitySource
    created_at: datetime
    school: Optional[SchoolResponse] = None
    
    class Config:
        from_attributes = True


# Lead schemas
class LeadCreate(BaseModel):
    activity_id: uuid.UUID
    child_age: int
    message: Optional[str] = None


class LeadResponse(BaseModel):
    id: uuid.UUID
    activity_id: uuid.UUID
    parent_id: uuid.UUID
    child_age: int
    message: Optional[str] = None
    status: LeadStatus
    created_at: datetime
    activity: Optional[ActivityResponse] = None
    parent: Optional[UserResponse] = None
    
    class Config:
        from_attributes = True


class LeadUpdateStatus(BaseModel):
    status: LeadStatus


# Review schemas
class ReviewCreate(BaseModel):
    school_id: uuid.UUID
    rating: int  # 1-5
    comment: Optional[str] = None


class ReviewResponse(BaseModel):
    id: uuid.UUID
    school_id: uuid.UUID
    parent_id: uuid.UUID
    rating: int
    comment: Optional[str] = None
    created_at: datetime
    school: Optional[SchoolResponse] = None
    parent: Optional[UserResponse] = None
    
    class Config:
        from_attributes = True