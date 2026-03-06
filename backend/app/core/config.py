from pydantic import BaseSettings
import os


class Settings(BaseSettings):
    database_url: str = os.getenv("DATABASE_URL", "postgresql://postgres:YOnWXWdCRPRG3dQQ@db.hulqbgfllkxjfnmgjupq.supabase.co:5432/postgres")
    jwt_secret_key: str = os.getenv("JWT_SECRET_KEY", "CHANGE-THIS-IN-PRODUCTION-VERY-LONG-SECRET-KEY-FOR-SECURITY")
    jwt_algorithm: str = os.getenv("JWT_ALGORITHM", "HS256")
    jwt_access_token_expire_minutes: int = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))  # 24 hours
    jwt_refresh_token_expire_days: int = int(os.getenv("JWT_REFRESH_TOKEN_EXPIRE_DAYS", "30"))
    
    class Config:
        env_file = ".env"


settings = Settings()