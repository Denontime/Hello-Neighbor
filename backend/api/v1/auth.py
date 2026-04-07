from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from core.security import verify_password, get_password_hash, create_access_token
from db.session import get_db
from models.domain import User
from pydantic import BaseModel
from datetime import timedelta
from core.config import settings

router = APIRouter()

class UserCreate(BaseModel):
    username: str
    password: str
    phone: str | None = None

class Token(BaseModel):
    access_token: str
    token_type: str

@router.post("/register")
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)) -> Any:
    # Check if user exists
    result = await db.execute(select(User).where(User.username == user_in.username))
    user = result.scalars().first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    user = User(
        username=user_in.username,
        password_hash=get_password_hash(user_in.password),
        phone=user_in.phone
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return {"userId": user.id}

@router.post("/login", response_model=Token)
async def login(
    db: AsyncSession = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    result = await db.execute(select(User).where(User.username == form_data.username))
    user = result.scalars().first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }
