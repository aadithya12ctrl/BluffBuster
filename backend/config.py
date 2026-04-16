"""
Configuration module — loads environment variables for all services.
"""
import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

LLM_API_KEY = os.getenv("LLM_API_KEY", "sk-live-02a2d375f09d2f74770fdf6c8efb3cb8c8472de52a7002d69bfdbdf716826007")
LLM_BASE_URL = os.getenv("LLM_BASE_URL", "https://api.aicredits.in/v1")
LLM_MODEL = os.getenv("LLM_MODEL", "meta-llama/llama-3-8b-instruct")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
CHROMADB_COLLECTION = os.getenv("CHROMADB_COLLECTION", "bluffbuster_claims")
SQLITE_DB = os.getenv("SQLITE_DB", os.path.join(os.path.dirname(__file__), "bluffbuster.db"))
