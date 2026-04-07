from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from pydantic import BaseModel
from datetime import datetime, timedelta

from api.deps import get_current_user
from db.session import get_db
from models.domain import Proposal, Vote, User

router = APIRouter()

class ProposalCreate(BaseModel):
    communityId: str
    type: str
    target: dict
    reason: str
    evidence: dict | None = None

@router.post("")
async def create_proposal(
    prop_in: ProposalCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    # Just a mock implementation for MVP
    prop = Proposal(
        community_id=prop_in.communityId,
        type=prop_in.type,
        scope="daily",
        target_type=prop_in.target.get("type"),
        target_id=prop_in.target.get("id"),
        reason=prop_in.reason,
        evidence_json=prop_in.evidence,
        created_by_user_id=current_user.id,
        deadline_at=datetime.utcnow() + timedelta(days=3),
        snapshot_json={"baseN": 20, "minVotes": 5}
    )
    db.add(prop)
    await db.commit()
    await db.refresh(prop)
    return {"proposalId": prop.id}

@router.get("")
async def get_proposals(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    stmt = select(Proposal).order_by(desc(Proposal.created_at))
    result = await db.execute(stmt)
    return result.scalars().all()

class VoteCreate(BaseModel):
    choice: str

@router.post("/{proposal_id}/vote")
async def vote_proposal(
    proposal_id: str,
    vote_in: VoteCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    vote = Vote(
        proposal_id=proposal_id,
        choice=vote_in.choice,
        voted_by_user_id=current_user.id
    )
    db.add(vote)
    await db.commit()
    return {"status": "VOTING", "counts": {"yes": 1, "no": 0, "abstain": 0}}
