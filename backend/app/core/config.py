from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_hostname: str
    database_port: str
    database_password: str
    database_name: str
    database_username: str
    secret_key: str
    algorithm: str
    access_token_expire_minutes: int
    openai_api_key: str
    recaptcha_secret_key: str
    google_client_id: str
    postgres_password: str
    postgres_db: str

    class Config:
        env_file = "../.env"

settings = Settings()
