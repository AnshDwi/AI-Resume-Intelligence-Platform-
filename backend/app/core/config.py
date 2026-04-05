from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "AI Talent Intelligence Platform API"
    api_v1_prefix: str = "/api/v1"
    secret_key: str = "change-me-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24

    database_url: str = "postgresql+psycopg://postgres:postgres@postgres:5432/talent_intel"
    redis_url: str = "redis://redis:6379/0"

    openai_api_key: str | None = None
    openai_model: str = "gpt-4o-mini"
    cors_origins: str = (
        "https://ai-resume-intelligence-platform.vercel.app,"
        "http://localhost:5173,"
        "http://127.0.0.1:5173"
    )

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", case_sensitive=False)


settings = Settings()
