from agents.memory import Session
from typing import Optional


class MemorySession(Session):
    def __init__(self, session_id: str = "default", user_id: Optional[int] = None):
        super().__init__(session_id=session_id)
        self.user_id = user_id
        self.items = []
        self.new_items = []

    async def get_items(self, limit: int | None = None) -> list[dict]:
        items_slice = self.items[-limit:] if limit else self.items
        return items_slice.copy()

    async def add_items(self, items: list[dict]) -> None:
        self.items.extend(items)
        self.new_items.extend(items)

    async def add_old_items(self, items: list[dict]) -> None:
        self.items.extend(items)

    async def pop_item(self) -> dict | None:
        return self.items.pop() if self.items else None

    async def clear_session(self) -> None:
        self.items.clear()
        self.new_items.clear()

    async def get_new_items(self) -> list[dict]:
        return self.new_items.copy()
