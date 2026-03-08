from sqlalchemy import Column, String, Integer, Float, Boolean, Text, DateTime, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
import enum
from app.database.base import Base


class UserRole(str, enum.Enum):
    PARENT = "parent"
    SCHOOL = "school"
    ADMIN = "admin"


class ActivitySource(str, enum.Enum):
    SCHOOL = "school"
    PARENT = "parent"
    SCRAPED = "scraped"


class LeadStatus(str, enum.Enum):
    NEW = "new"
    CONTACTED = "contacted"
    CLOSED = "closed"


class SchoolStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved" 
    REJECTED = "rejected"


class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False)  # plain string: 'parent', 'school', 'admin'
    refresh_token = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    created_schools = relationship("School", back_populates="created_by_user")
    created_activities = relationship("Activity", back_populates="created_by_user")
    leads = relationship("Lead", back_populates="parent")
    reviews = relationship("Review", back_populates="parent")


class Neighborhood(Base):
    __tablename__ = "neighborhoods"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    city = Column(String, nullable=False)
    name = Column(String, nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    
    # Relationships
    # schools = relationship("School", back_populates="neighborhood")


class School(Base):
    __tablename__ = "schools"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    description = Column(Text)
    phone = Column(String)
    email = Column(String)
    website = Column(String)  # External website URL
    city = Column(String, nullable=False)
    address = Column(String)
    neighborhood = Column(String, nullable=True)
    lat = Column(Float)
    lng = Column(Float)
    verified = Column(Boolean, default=False)  # Legacy field, use status instead
    status = Column(Enum(SchoolStatus), default=SchoolStatus.PENDING)  # New approval status
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    created_by_user = relationship("User", back_populates="created_schools")
    activities = relationship("Activity", back_populates="school")
    reviews = relationship("Review", back_populates="school")
    
    @property
    def average_rating(self):
        """Calculate average rating from reviews"""
        if not self.reviews:
            return None
        return sum(review.rating for review in self.reviews) / len(self.reviews)
    
    @property
    def review_count(self):
        """Count total reviews"""
        return len(self.reviews)
    
    @property
    def is_approved(self):
        """Check if school is approved"""
        return self.status == SchoolStatus.APPROVED


class Activity(Base):
    __tablename__ = "activities"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    school_id = Column(UUID(as_uuid=True), ForeignKey("schools.id"), nullable=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    category = Column(String, nullable=False)
    age_min = Column(Integer, nullable=False)
    age_max = Column(Integer, nullable=False)
    price_monthly = Column(String)  # Changed from Float to String for flexible pricing
    active = Column(Boolean, default=True)
    verified = Column(Boolean, default=False)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    source = Column(Enum(ActivitySource), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    school = relationship("School", back_populates="activities")
    created_by_user = relationship("User", back_populates="created_activities")
    leads = relationship("Lead", back_populates="activity")


class Lead(Base):
    __tablename__ = "leads"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    activity_id = Column(UUID(as_uuid=True), ForeignKey("activities.id"), nullable=False)
    parent_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    child_age = Column(Integer, nullable=False)
    message = Column(Text)
    status = Column(Enum(LeadStatus), default=LeadStatus.NEW)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    activity = relationship("Activity", back_populates="leads")
    parent = relationship("User", back_populates="leads")


class Review(Base):
    __tablename__ = "reviews"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    school_id = Column(UUID(as_uuid=True), ForeignKey("schools.id"), nullable=False)
    parent_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    rating = Column(Integer, nullable=False)  # 1-5
    comment = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    school = relationship("School", back_populates="reviews")
    parent = relationship("User", back_populates="reviews")