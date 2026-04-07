from fastapi import APIRouter

from . import auth, communities, invites, families, neighbors, boards, posts, proposals, notifications

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(communities.router, prefix="/communities", tags=["communities"])
api_router.include_router(invites.router, prefix="/invites", tags=["invites"])
api_router.include_router(families.router, prefix="/families", tags=["families"])
api_router.include_router(neighbors.router, prefix="/neighbors", tags=["neighbors"])
api_router.include_router(boards.router, prefix="/boards", tags=["boards"])
api_router.include_router(posts.router, prefix="/posts", tags=["posts"])
api_router.include_router(proposals.router, prefix="/proposals", tags=["proposals"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
