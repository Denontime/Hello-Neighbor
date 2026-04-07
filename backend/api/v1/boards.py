from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from api.deps import get_current_user
from db.session import get_db
from models.domain import Board, User

router = APIRouter()

@router.get("")
async def get_boards(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    result = await db.execute(select(Board).order_by(Board.sort_order))
    boards = result.scalars().all()
    return boards
