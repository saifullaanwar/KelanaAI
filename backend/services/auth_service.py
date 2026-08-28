import bcrypt

from jose import jwt
from sqlalchemy.orm import Session

from models.user import User


SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"


def hash_password(password: str) -> str:
    """
    Hash password menggunakan bcrypt.
    Password tidak pernah disimpan dalam bentuk plain text.
    """
    return bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")


def register(
    db: Session,
    name: str,
    email: str,
    password: str,
):
    """
    Register user baru.
    """

    existing_user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if existing_user:
        raise ValueError("Email already registered")

    user = User(
        name=name,
        email=email,
        password_hash=hash_password(password),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def login(
    db: Session,
    email: str,
    password: str,
):
    """
    Verify user credentials and generate JWT.
    """

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if user is None:
        raise ValueError("Invalid email or password")

    password_valid = bcrypt.checkpw(
        password.encode("utf-8"),
        user.password_hash.encode("utf-8"),
    )

    if not password_valid:
        raise ValueError("Invalid email or password")

    token = jwt.encode(
        {
            "sub": str(user.id),
        },
        SECRET_KEY,
        algorithm=ALGORITHM,
    )

    return {
        "access_token": token,
        "token_type": "bearer",
    }