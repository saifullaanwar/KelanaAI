from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from services.trip_service import (
    calculate_daily_budget,
    get_trip_category,
    get_transportation_recommendation,
)

from services.bedrock_service import get_ai_recommendation
from database import SessionLocal, init_db
from models.trip import Trip


# ============================================================
# REQUEST MODEL
# ============================================================

class TripRequest(BaseModel):
    destination: str
    days: int
    budget: float
    travel_style: str


# ============================================================
# APP
# ============================================================

app = FastAPI()


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
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
# CREATE TRIP
# ============================================================

@app.post("/api/v1/trips")
def create_trip(request: TripRequest):

    # --------------------------------------------------------
    # Calculate business logic
    # --------------------------------------------------------

    daily_budget = calculate_daily_budget(
        request.budget,
        request.days
    )

    category = get_trip_category(
        request.budget
    )

    recommendation_transport = get_transportation_recommendation(
        category
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
# GET ALL TRIPS
# ============================================================

@app.get("/api/v1/trips")
def list_trips():

    db = SessionLocal()

    try:

        trips = db.query(Trip).all()

        return trips

    finally:
        db.close()


# ============================================================
# GET ONE TRIP
# ============================================================

@app.get("/api/v1/trips/{trip_id}")
def get_trip(trip_id: int):

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
                detail=f"Trip with id {trip_id} not found"
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
# DELETE TRIP
# ============================================================

@app.delete("/api/v1/trips/{trip_id}")
def delete_trip(trip_id: int):

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
                detail=f"Trip with id {trip_id} not found"
            )

        db.delete(trip)
        db.commit()

        return {
            "message": f"Trip with id {trip_id} deleted successfully"
        }

    finally:
        db.close()


# ============================================================
# UPDATE TRIP
# ============================================================

@app.put("/api/v1/trips/{trip_id}")
def update_trip(
    trip_id: int,
    request: TripRequest
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

        if not trip:
            raise HTTPException(
                status_code=404,
                detail=f"Trip with id {trip_id} not found"
            )

        # ----------------------------------------------------
        # Recalculate business logic
        # ----------------------------------------------------

        daily_budget = calculate_daily_budget(
            request.budget,
            request.days
        )

        category = get_trip_category(
            request.budget
        )

        recommendation_transport = (
            get_transportation_recommendation(
                category
            )
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
# GENERATE AI RECOMMENDATION
# ============================================================

@app.post("/api/v1/trips/{trip_id}/generate")
def generate_trip_recommendation(trip_id: int):

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
                detail=f"Trip with id {trip_id} not found"
            )

        # ----------------------------------------------------
        # Generate AI recommendation
        # ----------------------------------------------------
        # IMPORTANT:
        # Use travel_style, NOT category.
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