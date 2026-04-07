import uuid
from datetime import datetime, timedelta
from sqlalchemy import Column, String, DateTime, Boolean, Integer, ForeignKey, JSON, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from db.base_class import Base

# Note: Since we are using SQLite for the sandbox, we'll use String for UUIDs
def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=generate_uuid)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    phone = Column(String, unique=True, index=True, nullable=True)
    status = Column(String, default="normal") # normal, muted, banned
    mute_until = Column(DateTime, nullable=True)
    banned_at = Column(DateTime, nullable=True)

class Community(Base):
    __tablename__ = "communities"
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    city = Column(String, nullable=True)
    current_stage = Column(Integer, default=20)
    governance_config_version_id = Column(String, nullable=True)
    
    families = relationship("Family", back_populates="community")

class InviteCode(Base):
    __tablename__ = "invite_codes"
    id = Column(String, primary_key=True, default=generate_uuid)
    community_id = Column(String, ForeignKey("communities.id"))
    code_hash = Column(String, unique=True, index=True)
    expires_at = Column(DateTime)
    max_uses = Column(Integer, default=1)
    used_count = Column(Integer, default=0)
    status = Column(String, default="active") # active, revoked
    created_by = Column(String, ForeignKey("users.id"))

class Family(Base):
    __tablename__ = "families"
    id = Column(String, primary_key=True, default=generate_uuid)
    community_id = Column(String, ForeignKey("communities.id"))
    name = Column(String, nullable=False)
    admin_user_id = Column(String, ForeignKey("users.id"))
    joined_at = Column(DateTime, default=datetime.utcnow)
    governance_enabled_at = Column(DateTime)

    community = relationship("Community", back_populates="families")
    members = relationship("FamilyMember", back_populates="family")

class FamilyMember(Base):
    __tablename__ = "family_members"
    id = Column(String, primary_key=True, default=generate_uuid)
    family_id = Column(String, ForeignKey("families.id"))
    user_id = Column(String, ForeignKey("users.id"))
    role_code = Column(String, nullable=False)
    joined_at = Column(DateTime, default=datetime.utcnow)

    family = relationship("Family", back_populates="members")
    user = relationship("User")

class NeighborFriendship(Base):
    __tablename__ = "neighbor_friendships"
    id = Column(String, primary_key=True, default=generate_uuid)
    community_id = Column(String, ForeignKey("communities.id"))
    from_family_id = Column(String, ForeignKey("families.id"))
    to_family_id = Column(String, ForeignKey("families.id"))
    status = Column(String, default="pending") # pending, accepted, rejected

class Board(Base):
    __tablename__ = "boards"
    id = Column(String, primary_key=True, default=generate_uuid)
    code = Column(String, unique=True, index=True)
    name_cn = Column(String, nullable=False)
    is_system = Column(Boolean, default=False)
    enabled = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)

class Post(Base):
    __tablename__ = "posts"
    id = Column(String, primary_key=True, default=generate_uuid)
    community_id = Column(String, ForeignKey("communities.id"))
    board_id = Column(String, ForeignKey("boards.id"))
    author_user_id = Column(String, ForeignKey("users.id"))
    author_family_id = Column(String, ForeignKey("families.id"))
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    visibility = Column(String, default="community") # community, friends
    event_time = Column(DateTime, nullable=True)
    location_text = Column(String, nullable=True)
    status = Column(String, default="normal") # normal, hidden
    hidden_by_proposal_id = Column(String, nullable=True)

class Comment(Base):
    __tablename__ = "comments"
    id = Column(String, primary_key=True, default=generate_uuid)
    post_id = Column(String, ForeignKey("posts.id"))
    author_user_id = Column(String, ForeignKey("users.id"))
    author_family_id = Column(String, ForeignKey("families.id"))
    content = Column(Text, nullable=False)
    status = Column(String, default="normal") # normal, hidden
    hidden_by_proposal_id = Column(String, nullable=True)

class Participation(Base):
    __tablename__ = "participations"
    id = Column(String, primary_key=True, default=generate_uuid)
    post_id = Column(String, ForeignKey("posts.id"))
    user_id = Column(String, ForeignKey("users.id"))
    family_id = Column(String, ForeignKey("families.id"))
    status = Column(String, default="joined")

class GovernanceConfigVersion(Base):
    __tablename__ = "governance_config_versions"
    id = Column(String, primary_key=True, default=generate_uuid)
    community_id = Column(String, ForeignKey("communities.id"))
    version = Column(Integer, nullable=False)
    config_json = Column(JSON, nullable=False)
    effective_at = Column(DateTime, nullable=False)

class Proposal(Base):
    __tablename__ = "proposals"
    id = Column(String, primary_key=True, default=generate_uuid)
    community_id = Column(String, ForeignKey("communities.id"))
    type = Column(String, nullable=False) # HIDE_POST, UNMUTE_USER, etc.
    scope = Column(String, nullable=False) # daily, global
    target_type = Column(String, nullable=True) # post, user, comment
    target_id = Column(String, nullable=True)
    reason = Column(Text, nullable=False)
    evidence_json = Column(JSON, nullable=True)
    status = Column(String, default="VOTING") # VOTING, PASSED, FAILED, FAILED_EARLY_VETO, EXPIRED
    created_by_user_id = Column(String, ForeignKey("users.id"))
    created_by_family_id = Column(String, ForeignKey("families.id"))
    deadline_at = Column(DateTime, nullable=False)
    snapshot_json = Column(JSON, nullable=False)

class Vote(Base):
    __tablename__ = "votes"
    id = Column(String, primary_key=True, default=generate_uuid)
    proposal_id = Column(String, ForeignKey("proposals.id"))
    family_id = Column(String, ForeignKey("families.id"))
    choice = Column(String, nullable=False) # YES, NO, ABSTAIN
    voted_by_user_id = Column(String, ForeignKey("users.id"))
    voted_at = Column(DateTime, default=datetime.utcnow)

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    type = Column(String, nullable=False)
    payload_json = Column(JSON, nullable=False)
    read_at = Column(DateTime, nullable=True)
