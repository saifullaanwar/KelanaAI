from dotenv import load_dotenv

from sqlalchemy import create_engine, text
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
    from models.user import User
    from models.trip import Trip
    from models.conversation import Conversation
    from models.message import Message

    Base.metadata.create_all(bind=engine)

    # ----------------------------------------------------------
    # Safe column migration — adds title to conversations if it
    # does not exist yet (for databases created before this
    # column was added). Uses IF NOT EXISTS so it is idempotent
    # and safe to run on every startup.
    # ----------------------------------------------------------

    with engine.connect() as conn:
        try:
            conn.execute(
                text(
                    "ALTER TABLE conversations "
                    "ADD COLUMN IF NOT EXISTS title VARCHAR(256)"
                )
            )
            conn.commit()
        except Exception:
            # Some databases (e.g. SQLite) don't support
            # IF NOT EXISTS on ALTER TABLE — ignore safely.
            conn.rollback()