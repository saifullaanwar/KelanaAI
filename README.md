# KelanaAI

KelanaAI is a travel planning application built with Python during the AI Native Software Engineer Bootcamp.

The project is developed progressively from a simple console application into a REST API using FastAPI.

---

## Project Structure

    kelana-ai/
    ├── README.md
    ├── .gitignore
    ├── backend/
    │   ├── main.py
    │   ├── requirements.txt
    │   └── services/
    │       └── trip_service.py
    └── frontend/
        └── .gitkeep

### Description

- `backend/main.py` — FastAPI application and REST API endpoints.
- `backend/services/trip_service.py` — contains the application's business logic.
- `backend/requirements.txt` — Python dependencies.
- `frontend/` — reserved for future frontend development.
- `.gitignore` — prevents unnecessary files such as Python cache and virtual environments from being tracked by Git.

---

## Session 1 — Trip Summary Generator

The first version of KelanaAI introduced the fundamentals of Python programming.

### Features

- Interactive user input
- Variables and data types
- Type conversion using `int()` and `float()`
- Functions and parameters
- f-string formatting
- Basic conditional logic
- Git and GitHub workflow

### Trip Information

The application collects:

- Destination
- Country
- Days
- Budget
- Currency
- Travel Month

---

## Session 2 — Recommendation Engine

Session 2 makes KelanaAI smarter by introducing business logic, recommendations, lists, loops, and modular architecture.

### Features

- Trip category calculation
- Daily budget calculation
- Transportation recommendation
- Travel season detection
- Recommended places
- Multiple destinations
- Lists and loops
- Layered architecture

### Trip Category

| Budget | Category |
|---|---|
| `< 1000` | Backpacker |
| `1000 - 3000` | Standard |
| `> 3000` | Luxury |

### Transportation

| Category | Recommendation |
|---|---|
| Backpacker | Bus |
| Standard | Train |
| Luxury | Flight |

### Travel Season

| Month | Season |
|---|---|
| December | Peak Season |
| June | Holiday Season |
| Other months | Regular Season |

---

## Session 3 — REST API with FastAPI

Session 3 transforms KelanaAI from a console application into a REST API using FastAPI and Uvicorn.

The API reuses the business logic from `trip_service.py`.

### Technologies

- Python
- FastAPI
- Uvicorn
- Pydantic
- Git & GitHub

### API Endpoints

#### GET `/`

Returns a welcome message.

    {
      "message": "Welcome to KelanaAI"
    }

#### GET `/health`

Returns the API health status.

    {
      "status": "OK"
    }

#### POST `/api/v1/trips`

Creates a trip recommendation based on the submitted travel information.

Example request:

    {
      "destination": "Japan",
      "days": 5,
      "budget": 2000,
      "travel_style": "Family"
    }

Example response:

    {
      "destination": "Japan",
      "budget": 2000.0,
      "daily_budget": 400.0,
      "category": "Standard",
      "travel_style": "Family",
      "recommendation_transport": "Train"
    }

#### GET `/api/v1/trip-categories`

Returns all available trip categories.

    [
      "Backpacker",
      "Standard",
      "Luxury"
    ]

#### GET `/api/v1/recommendations`

Returns recommended destinations.

    [
      "Tokyo Tower",
      "Mount Fuji",
      "Shibuya"
    ]

#### GET `/api/v1/transportations`

Returns available transportation recommendations.

    [
      "Bus",
      "Train",
      "Flight"
    ]

---

## How to Run

Navigate to the backend directory:

    cd backend

Activate the virtual environment if needed:

    .venv\Scripts\activate

Install dependencies:

    pip install -r requirements.txt

Start the FastAPI server:

    uvicorn main:app --reload

The API will be available at:

    http://localhost:8000

Interactive API documentation:

    http://localhost:8000/docs

---

## Git Version Control

### Session 1

    git add .
    git commit -m "Create initial KelanaAI console app"
    git tag v0.1.0
    git push origin v0.1.0

### Session 2

    git add .
    git commit -m "Add recommendation engine"
    git push
    git tag session-2
    git push origin session-2

### Session 3

    git add .
    git commit -m "Convert KelanaAI into FastAPI"
    git push
    git tag session-3
    git push origin session-3

---

## Current Status

- Session 1 — Completed
- Session 2 — Completed
- Session 3 — Completed

KelanaAI currently provides:

- Travel information management
- Budget calculation
- Trip category classification
- Travel season detection
- Transportation recommendations
- Destination recommendations
- REST API endpoints
- API health check
- Interactive Swagger documentation

---

## Future Development

Future sessions will extend KelanaAI with persistent data storage using PostgreSQL and additional features toward a more complete AI-powered travel planning system.