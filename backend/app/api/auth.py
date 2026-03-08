from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database.base import get_db
from app.models.models import User
from app.core.auth import get_password_hash, verify_password, create_access_token, create_refresh_token, get_current_user, verify_token

router = APIRouter(prefix="/auth", tags=["Authentication"])


class RegisterRequest(BaseModel):
    email: str
    password: str
    role: str = "parent"


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    """Register — no frills."""
    print(f"DEBUG register: {data.email} role={data.role}")

    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=data.email,
        password_hash=get_password_hash(data.password),
        role=data.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    print(f"DEBUG register OK: {user.id}")
    return {"id": str(user.id), "email": user.email, "role": user.role, "created_at": str(user.created_at)}


@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    """Login — returns JWT tokens."""
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    refresh_token = create_refresh_token(data={"sub": user.email, "role": user.role})

    user.refresh_token = refresh_token
    db.commit()

    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}


@router.get("/me")
def me(current_user: User = Depends(get_current_user)):
    return {"id": str(current_user.id), "email": current_user.email, "role": current_user.role, "created_at": str(current_user.created_at)}
