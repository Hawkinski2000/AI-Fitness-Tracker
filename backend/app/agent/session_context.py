from contextvars import ContextVar
from app.agent.memory import MemorySession


current_session: ContextVar[MemorySession] = ContextVar("current_session")
