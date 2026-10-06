import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file from the project root
env_path = Path(__file__).parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

class Settings:
    PROJECT_NAME: str = "SocraticLens Gemma 4 Tutor"
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    # 1st: Ultra-fast Gemini Flash model as primary
    PRIMARY_MODEL: str = os.getenv("GEMMA_MODEL", "gemini-3.5-flash")
    # 2nd & 3rd: Secondary Gemini, then Gemma
    FALLBACK_MODEL: str = os.getenv("FALLBACK_MODEL", "gemma-4-26b-a4b-it")

settings = Settings()
