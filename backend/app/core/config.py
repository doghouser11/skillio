from pydantic import BaseSettings
import os


class Settings(BaseSettings):
    database_url: str = os.getenv("DATABASE_URL", "postgresql://postgres:YOnWXWdCRPRG3dQQ@db.hulqbgfllkxjfnmgjupq.supabase.co:5432/postgres")
    jwt_secret_key: str = os.getenv("JWT_SECRET_KEY", "your-jwt-secret-key-change-in-production")
    jwt_algorithm: str = os.getenv("JWT_ALGORITHM", "HS256")
    jwt_access_token_expire_minutes: int = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "15"))
    jwt_refresh_token_expire_days: int = int(os.getenv("JWT_REFRESH_TOKEN_EXPIRE_DAYS", "7"))
    
    class Config:
        env_file = ".env"


settings = Settings()