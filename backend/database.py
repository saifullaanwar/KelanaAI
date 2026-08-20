from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# Load environment variables
load_dotenv()

# Database connection string
DATABASE_URL = os.getenv("DATABASE_URL")

# Create database engine
engine = create_engine(DATABASE_URL)

# Create database session
SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False
)

# Base class for SQLAlchemy models
Base = declarative_base()


def init_db():
    from models.trip import Trip

    Base.metadata.create_all(bind=engine)