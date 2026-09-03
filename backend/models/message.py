from sqlalchemy import Column, BigInteger, String, Text, DateTime, ForeignKey
from database import Base
from datetime import datetime


class Message(Base):
    __tablename__ = "messages"

    id = Column(BigInteger, primary_key=True, autoincrement=True)

    conversation_id = Column(
        BigInteger,
        ForeignKey("conversations.id"),
        nullable=False
    )

    title = Column(
        String(256),
        nullable=True
    )

    role = Column(
        String(16),
        nullable=False
    )

    content = Column(
        Text,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )