from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from jose import jwt, JWTError
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from models.user import User

from services.trip_service import (
    calculate_daily_budget,
    get_trip_category,
    get_transportation_recommendation,
)

from services.bedrock_service import get_ai_recommendation
from services.auth_service import register, login
from services.kb_service import ask_knowledge_base

from database import SessionLocal, init_db
from models.trip import Trip


# ============================================================
# JWT CONFIGURATION
# ============================================================

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

security = HTTPBearer()


# ============================================================
# GET CURRENT USER FROM JWT
# ============================================================

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        user_id = payload.get("sub")

        if user_id is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid token",
            )

        db = SessionLocal()

        try:
            user = (
                db.query(User)
                .filter(User.id == int(user_id))
                .first()
            )

            if user is None:
                raise HTTPException(
                    status_code=401,
                    detail="User not found",
                )

            return user

        finally:
            db.close()

    except (JWTError, ValueError):
        raise HTTPException(
            status_code=401,
            detail="Invalid token",
        )


# ============================================================
# REQUEST MODELS
# ============================================================

class TripRequest(BaseModel):
    destination: str
    days: int
    budget: float
    travel_style: str


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class QuestionRequest(BaseModel):
    question: str


# ============================================================
# APP
# ============================================================

app = FastAPI()


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# DATABASE
# ============================================================

init_db()


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def home():
    return {
        "message": "Welcome to KelanaAI"
    }


# ============================================================
# HEALTH
# ============================================================

@app.get("/health")
def health():
    return {
        "status": "OK"
    }


# ============================================================
# REGISTER USER
# ============================================================

@app.post("/api/v1/auth/register")
def register_user(
    request: RegisterRequest,
):
    db = SessionLocal()

    try:
        try:
            user = register(
                db=db,
                name=request.name,
                email=request.email,
                password=request.password,
            )

        except ValueError as error:
            raise HTTPException(
                status_code=400,
                detail=str(error),
            )

        return {
            "id": user.id,
            "name": user.name,
            "email": user.email,
        }

    finally:
        db.close()


# ============================================================
# LOGIN USER
# ============================================================

@app.post("/api/v1/auth/login")
def login_user(
    request: LoginRequest,
):
    db = SessionLocal()

    try:
        try:
            result = login(
                db=db,
                email=request.email,
                password=request.password,
            )

        except ValueError as error:
            raise HTTPException(
                status_code=401,
                detail=str(error),
            )

        return result

    finally:
        db.close()


# ============================================================
# GET CURRENT USER
# ============================================================

@app.get("/api/v1/auth/me")
def get_me(
    user: User = Depends(get_current_user),
):
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
    }


# ============================================================
# CREATE TRIP
# ============================================================

@app.post("/api/v1/trips")
def create_trip(
    request: TripRequest,
    user: User = Depends(get_current_user),
):

    # --------------------------------------------------------
    # Calculate business logic
    # --------------------------------------------------------

    daily_budget = calculate_daily_budget(
        request.budget,
        request.days,
    )

    category = get_trip_category(
        request.budget
    )

    recommendation_transport = (
        get_transportation_recommendation(category)
    )

    # --------------------------------------------------------
    # Create database session
    # --------------------------------------------------------

    db = SessionLocal()

    try:

        # ----------------------------------------------------
        # Generate AI itinerary
        # ----------------------------------------------------

        ai_recommendation = get_ai_recommendation(
            destination=request.destination,
            days=request.days,
            budget=request.budget,
            travel_style=request.travel_style,
        )

        # ----------------------------------------------------
        # Create Trip
        # ----------------------------------------------------

        trip = Trip(
            user_id=user.id,
            destination=request.destination,
            days=request.days,
            budget=request.budget,
            category=category,
            travel_style=request.travel_style,
            daily_budget=daily_budget,
            ai_recommendation=ai_recommendation,
        )

        # ----------------------------------------------------
        # Save to database
        # ----------------------------------------------------

        db.add(trip)
        db.commit()
        db.refresh(trip)

        # ----------------------------------------------------
        # Response
        # ----------------------------------------------------

        return {
            "id": trip.id,
            "destination": trip.destination,
            "days": trip.days,
            "budget": trip.budget,
            "daily_budget": trip.daily_budget,
            "category": trip.category,
            "travel_style": trip.travel_style,
            "recommendation_transport": recommendation_transport,
            "ai_recommendation": trip.ai_recommendation,
        }

    finally:
        db.close()


# ============================================================
# TRIP CATEGORIES
# ============================================================

@app.get("/api/v1/trip-categories")
def get_trip_categories():
    return [
        "Backpacker",
        "Standard",
        "Luxury",
    ]


# ============================================================
# DESTINATION RECOMMENDATIONS
# ============================================================

@app.get("/api/v1/recommendations")
def get_recommendations():
    return [
        "Tokyo Tower",
        "Mount Fuji",
        "Shibuya",
    ]


# ============================================================
# TRANSPORTATION RECOMMENDATIONS
# ============================================================

@app.get("/api/v1/transportations")
def get_transportations():
    return [
        "Bus",
        "Train",
        "Flight",
    ]


# ============================================================
# GET ALL TRIPS - ONLY CURRENT USER
# ============================================================

@app.get("/api/v1/trips")
def list_trips(
    user: User = Depends(get_current_user),
):

    db = SessionLocal()

    try:
        trips = (
            db.query(Trip)
            .filter(Trip.user_id == user.id)
            .all()
        )

        return trips

    finally:
        db.close()


# ============================================================
# GET ONE TRIP - ONLY OWNER
# ============================================================

@app.get("/api/v1/trips/{trip_id}")
def get_trip(
    trip_id: int,
    user: User = Depends(get_current_user),
):

    db = SessionLocal()

    try:
        trip = (
            db.query(Trip)
            .filter(Trip.id == trip_id)
            .first()
        )

        if trip is None:
            raise HTTPException(
                status_code=404,
                detail=f"Trip with id {trip_id} not found",
            )

        # ----------------------------------------------------
        # OWNERSHIP CHECK
        # ----------------------------------------------------

        if trip.user_id != user.id:
            raise HTTPException(
                status_code=403,
                detail="You do not have permission to access this trip",
            )

        return {
            "id": trip.id,
            "destination": trip.destination,
            "days": trip.days,
            "budget": trip.budget,
            "category": trip.category,
            "travel_style": trip.travel_style,
            "daily_budget": trip.daily_budget,
            "ai_recommendation": trip.ai_recommendation,
        }

    finally:
        db.close()


# ============================================================
# DELETE TRIP - ONLY OWNER
# ============================================================

@app.delete("/api/v1/trips/{trip_id}")
def delete_trip(
    trip_id: int,
    user: User = Depends(get_current_user),
):

    db = SessionLocal()

    try:
        trip = (
            db.query(Trip)
            .filter(Trip.id == trip_id)
            .first()
        )

        if trip is None:
            raise HTTPException(
                status_code=404,
                detail=f"Trip with id {trip_id} not found",
            )

        # ----------------------------------------------------
        # OWNERSHIP CHECK
        # ----------------------------------------------------

        if trip.user_id != user.id:
            raise HTTPException(
                status_code=403,
                detail="You do not have permission to delete this trip",
            )

        db.delete(trip)
        db.commit()

        return {
            "message": f"Trip with id {trip_id} deleted successfully"
        }

    finally:
        db.close()


# ============================================================
# UPDATE TRIP - ONLY OWNER
# ============================================================

@app.put("/api/v1/trips/{trip_id}")
def update_trip(
    trip_id: int,
    request: TripRequest,
    user: User = Depends(get_current_user),
):

    db = SessionLocal()

    try:

        # ----------------------------------------------------
        # Find existing trip
        # ----------------------------------------------------

        trip = (
            db.query(Trip)
            .filter(Trip.id == trip_id)
            .first()
        )

        if trip is None:
            raise HTTPException(
                status_code=404,
                detail=f"Trip with id {trip_id} not found",
            )

        # ----------------------------------------------------
        # OWNERSHIP CHECK
        # ----------------------------------------------------

        if trip.user_id != user.id:
            raise HTTPException(
                status_code=403,
                detail="You do not have permission to update this trip",
            )

        # ----------------------------------------------------
        # Recalculate business logic
        # ----------------------------------------------------

        daily_budget = calculate_daily_budget(
            request.budget,
            request.days,
        )

        category = get_trip_category(
            request.budget
        )

        recommendation_transport = (
            get_transportation_recommendation(category)
        )

        # ----------------------------------------------------
        # Update database fields
        # ----------------------------------------------------

        trip.destination = request.destination
        trip.days = request.days
        trip.budget = request.budget
        trip.category = category
        trip.travel_style = request.travel_style
        trip.daily_budget = daily_budget

        # ----------------------------------------------------
        # Save changes
        # ----------------------------------------------------

        db.commit()
        db.refresh(trip)

        # ----------------------------------------------------
        # Response
        # ----------------------------------------------------

        return {
            "id": trip.id,
            "destination": trip.destination,
            "days": trip.days,
            "budget": trip.budget,
            "daily_budget": trip.daily_budget,
            "category": trip.category,
            "travel_style": trip.travel_style,
            "recommendation_transport": recommendation_transport,
            "ai_recommendation": trip.ai_recommendation,
        }

    finally:
        db.close()


# ============================================================
# GENERATE AI RECOMMENDATION - ONLY OWNER
# ============================================================

@app.post("/api/v1/trips/{trip_id}/generate")
def generate_trip_recommendation(
    trip_id: int,
    user: User = Depends(get_current_user),
):

    db = SessionLocal()

    try:

        # ----------------------------------------------------
        # Retrieve existing trip
        # ----------------------------------------------------

        trip = (
            db.query(Trip)
            .filter(Trip.id == trip_id)
            .first()
        )

        if trip is None:
            raise HTTPException(
                status_code=404,
                detail=f"Trip with id {trip_id} not found",
            )

        # ----------------------------------------------------
        # OWNERSHIP CHECK
        # ----------------------------------------------------

        if trip.user_id != user.id:
            raise HTTPException(
                status_code=403,
                detail="You do not have permission to generate this trip",
            )

        # ----------------------------------------------------
        # Generate AI recommendation
        # ----------------------------------------------------

        ai_recommendation = get_ai_recommendation(
            destination=trip.destination,
            days=trip.days,
            budget=trip.budget,
            travel_style=trip.travel_style,
        )

        # ----------------------------------------------------
        # Save AI recommendation
        # ----------------------------------------------------

        trip.ai_recommendation = ai_recommendation

        db.commit()
        db.refresh(trip)

        # ----------------------------------------------------
        # Response
        # ----------------------------------------------------

        return {
            "trip_id": trip.id,
            "destination": trip.destination,
            "travel_style": trip.travel_style,
            "recommendation": trip.ai_recommendation,
        }

    finally:
        db.close()


# ============================================================
# KNOWLEDGE BASE ASSISTANT
# ============================================================

@app.post("/api/v1/assistant")
def ask_assistant(
    request: QuestionRequest,
    user: User = Depends(get_current_user),
):

    # --------------------------------------------------------
    # Send question to Knowledge Base
    # --------------------------------------------------------

    result = ask_knowledge_base(
        request.question
    )

    # --------------------------------------------------------
    # DEBUG: Log sources sebelum dikirim ke client
    # --------------------------------------------------------

    sources = result.get("sources", [])

    print(f"[MAIN] /api/v1/assistant — jumlah sources: {len(sources)}")

    for i, src in enumerate(sources):
        has_url = bool(src.get("url"))
        url_preview = src.get("url", "")[:80] if has_url else "None"
        print(
            f"[MAIN] Source[{i}] "
            f"name={src.get('name')!r} "
            f"url_ada={has_url} "
            f"url_preview={url_preview!r}"
        )

    response_body = {
        "question": request.question,
        "answer": result.get("answer", ""),
        "sources": sources,
    }

    print(f"[MAIN] Response body keys: {list(response_body.keys())}")
    print(f"[MAIN] sources dalam response: {response_body['sources']}")

    # --------------------------------------------------------
    # Return grounded answer + sources
    # --------------------------------------------------------

    return response_body