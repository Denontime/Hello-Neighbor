from typing import Any
from sqlalchemy.orm import as_declarative, declared_attr
from datetime import datetime
from sqlalchemy import Column, DateTime

@as_declarative()
class Base:
    id: Any
    __name__: str
    
    # Generate __tablename__ automatically
    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower()
        
    created_at = Column(DateTime, default=datetime.utcnow)
