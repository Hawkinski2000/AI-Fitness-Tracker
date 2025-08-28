from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    database_hostname: str
    database_port: str
    database_password: str
    database_name: str
    database_username: str
    secret_key: str
    algorithm: str
    access_token_expire_minutes: int
    openai_api_key: Optional[str] = None
    postgres_password: Optional[str] = None
    postgres_db: Optional[str] = None

    class Config:
        env_file = "../.env"

settings = Settings()
