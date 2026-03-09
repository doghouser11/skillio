from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import httpx
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


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


@router.post("/change-password")
def change_password(data: ChangePasswordRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not verify_password(data.current_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Грешна текуща парола")
    current_user.password_hash = get_password_hash(data.new_password)
    db.commit()
    return {"message": "Password changed"}


# --- OAuth ---

class OAuthRequest(BaseModel):
    provider: str  # 'google' or 'facebook'
    token: str
    role: Optional[str] = "parent"


async def _verify_google_token(token: str) -> dict:
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={token}")
    if resp.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid Google token")
    data = resp.json()
    if "email" not in data:
        raise HTTPException(status_code=401, detail="Google token missing email")
    return {"email": data["email"], "name": data.get("name", "")}


async def _verify_facebook_token(token: str) -> dict:
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"https://graph.facebook.com/me?fields=email,name&access_token={token}")
    if resp.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid Facebook token")
    data = resp.json()
    if "email" not in data:
        raise HTTPException(status_code=401, detail="Facebook token missing email")
    return {"email": data["email"], "name": data.get("name", "")}


@router.post("/oauth")
async def oauth_login(oauth_data: OAuthRequest, db: Session = Depends(get_db)):
    if oauth_data.provider == "google":
        user_info = await _verify_google_token(oauth_data.token)
    elif oauth_data.provider == "facebook":
        user_info = await _verify_facebook_token(oauth_data.token)
    else:
        raise HTTPException(status_code=400, detail="Unsupported provider")

    email = user_info["email"]
    user = db.query(User).filter(User.email == email).first()
    if not user:
        role = oauth_data.role if oauth_data.role in ("parent", "school") else "parent"
        user = User(email=email, password_hash=None, role=role, auth_provider=oauth_data.provider)
        db.add(user)
        db.commit()
        db.refresh(user)

    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    refresh_token = create_refresh_token(data={"sub": user.email, "role": user.role})
    user.refresh_token = refresh_token
    db.commit()

    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}
