from pydantic_settings import BaseSettings
from pydantic import Field
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # Database
    database_url: str = Field(default="postgresql://postgres:postgres@localhost/shoppingcart")
    
    # JWT
    secret_key: str = Field(default="your-secret-key-here")
    algorithm: str = Field(default="HS256")
    access_token_expire_minutes: int = Field(default=30)
    
    # Stripe
    stripe_secret_key: str = Field(default="sk_test_...")
    stripe_publishable_key: str = Field(default="pk_test_...")
    
    # OpenAI
    openai_api_key: str = Field(default="sk-...")
    
    # CORS
    allowed_origins: list = Field(default=["http://localhost:3000"])
    
    class Config:
        env_file = ".env"

settings = Settings()