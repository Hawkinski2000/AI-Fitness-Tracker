from agents.memory import Session
from typing import List


class MemorySession(Session):
    def __init__(self, session_id: str = "default"):
        self.session_id = session_id
        self.items = []

    async def get_items(self, limit: int | None = None) -> List[dict]:
        return self.items[-limit:] if limit else self.items

    async def add_items(self, items: List[dict]) -> None:
        self.items.extend(items)

    async def pop_item(self) -> dict | None:
        return self.items.pop() if self.items else None

    async def clear_session(self) -> None:
        self.items.clear()
