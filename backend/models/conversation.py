from sqlalchemy import Column, BigInteger, String, DateTime, ForeignKey
from database import Base
from datetime import datetime


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(BigInteger, primary_key=True, autoincrement=True)

    user_id = Column(
        BigInteger,
        ForeignKey("users.id"),
        nullable=False
    )

    title = Column(
        String(256),
        nullable=True,
        default=None,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )