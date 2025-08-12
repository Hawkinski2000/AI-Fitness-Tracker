from agents.memory import Session
from typing import List


class MemorySession(Session):
    def __init__(self, session_id: str = "default"):
        self.session_id = session_id
        self.items = []
        self.new_items = []

    async def get_items(self, limit: int | None = None) -> List[dict]:
        items_slice = self.items[-limit:] if limit else self.items
        return items_slice.copy()

    async def add_items(self, items: List[dict]) -> None:
        self.items.extend(items)
        self.new_items.extend(items)

    async def add_old_items(self, items: List[dict]) -> None:
        self.items.extend(items)

    async def pop_item(self) -> dict | None:
        return self.items.pop() if self.items else None

    async def clear_session(self) -> None:
        self.items.clear()
        self.new_items.clear()

    async def get_new_items(self) -> List[dict]:
        return self.new_items.copy()
