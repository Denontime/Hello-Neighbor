from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from pydantic import BaseModel
from datetime import datetime

from api.deps import get_current_user
from db.session import get_db
from models.domain import Post, User

router = APIRouter()

class PostCreate(BaseModel):
    communityId: str
    boardCode: str
    title: str
    content: str
    visibility: str = "community"
    eventTime: str | None = None
    locationText: str | None = None

@router.get("")
async def get_posts(
    boardCode: str | None = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    stmt = select(Post).where(Post.status == "normal").order_by(desc(Post.created_at))
    # Join with boards to filter by code would be better, but simplified for MVP
    result = await db.execute(stmt)
    posts = result.scalars().all()
    return posts

@router.post("")
async def create_post(
    post_in: PostCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    post = Post(
        community_id=post_in.communityId,
        # For simplicity, store boardCode directly or resolve board_id
        # Here we mock board_id using boardCode as it's just an MVP 
        board_id=post_in.boardCode, 
        author_user_id=current_user.id,
        title=post_in.title,
        content=post_in.content,
        visibility=post_in.visibility,
        location_text=post_in.locationText
    )
    if post_in.eventTime:
        post.event_time = datetime.fromisoformat(post_in.eventTime.replace("Z", "+00:00"))
    db.add(post)
    await db.commit()
    await db.refresh(post)
    return {"postId": post.id}
