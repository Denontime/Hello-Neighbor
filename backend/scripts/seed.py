import asyncio
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from sqlalchemy import select
from db.session import SessionLocal
from models.domain import Board

async def seed():
    async with SessionLocal() as db:
        boards = [
            {"code": "DINNER", "name_cn": "约饭", "sort_order": 10, "is_system": True},
            {"code": "BABYSIT", "name_cn": "帮带娃", "sort_order": 20, "is_system": True},
            {"code": "DOGWALK", "name_cn": "帮遛狗", "sort_order": 30, "is_system": True},
            {"code": "CARPOOL", "name_cn": "上班拼车", "sort_order": 40, "is_system": True},
            {"code": "SPORT", "name_cn": "一起运动", "sort_order": 50, "is_system": True},
        ]
        for b in boards:
            result = await db.execute(select(Board).where(Board.code == b["code"]))
            existing = result.scalars().first()
            if not existing:
                board = Board(**b)
                db.add(board)
        await db.commit()
        print("Seeded boards successfully.")

if __name__ == "__main__":
    asyncio.run(seed())
