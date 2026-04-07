from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Neighbor Hello"
    API_V1_STR: str = "/api/v1"
    
    # Use SQLite for sandbox compatibility
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        return "sqlite+aiosqlite:///./neighbor.db"
        
    SECRET_KEY: str = "supersecretkey_please_change_in_production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    class Config:
        case_sensitive = True

settings = Settings()
