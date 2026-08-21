# KelanaAI

KelanaAI is a travel planning application built with Python during the AI Native Software Engineer Bootcamp.

The project is developed progressively from a simple console application into a REST API using FastAPI, with persistent data storage using PostgreSQL and SQLAlchemy ORM.

---

## Project Structure

```text
kelana-ai/
├── README.md
├── .gitignore
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── requirements.txt
│   ├── models/
│   │   └── trip.py
│   └── services/
│       └── trip_service.py
└── frontend/
    └── .gitkeep
```

### Description

- `backend/main.py` — FastAPI application and REST API endpoints.
- `backend/database.py` — PostgreSQL database connection and SQLAlchemy session configuration.
- `backend/models/trip.py` — SQLAlchemy Trip database model.
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

```json
{
  "message": "Welcome to KelanaAI"
}
```

#### GET `/health`

Returns the API health status.

```json
{
  "status": "OK"
}
```

#### POST `/api/v1/trips`

Creates a new trip recommendation based on the submitted travel information.

Example request:

```json
{
  "destination": "Japan",
  "days": 5,
  "budget": 2000,
  "travel_style": "Cultural"
}
```

Example response:

```json
{
  "id": 1,
  "destination": "Japan",
  "budget": 2000,
  "daily_budget": 400,
  "category": "Standard",
  "travel_style": "Cultural",
  "recommendation_transport": "Train"
}
```

#### GET `/api/v1/trip-categories`

Returns all available trip categories.

```json
[
  "Backpacker",
  "Standard",
  "Luxury"
]
```

#### GET `/api/v1/recommendations`

Returns recommended destinations.

```json
[
  "Tokyo Tower",
  "Mount Fuji",
  "Shibuya"
]
```

#### GET `/api/v1/transportations`

Returns available transportation recommendations.

```json
[
  "Bus",
  "Train",
  "Flight"
]
```

---

## Session 4 — PostgreSQL Persistence

Session 4 introduces persistent data storage to KelanaAI.

The application is no longer stateless. Trip data is now stored permanently in a PostgreSQL database using SQLAlchemy ORM.

### Technologies

- Python
- FastAPI
- Uvicorn
- Pydantic
- PostgreSQL
- SQLAlchemy
- Git & GitHub

### Database

KelanaAI uses PostgreSQL as the persistent database.

The `trips` table stores:

- Trip ID
- Destination
- Number of days
- Budget
- Trip category
- Daily budget

### ORM Model

The database model is defined in:

```text
backend/models/trip.py
```

The database connection and SQLAlchemy session are configured in:

```text
backend/database.py
```

### CRUD API

Session 4 completes the basic CRUD operations for trips.

#### Create — POST `/api/v1/trips`

Creates a new trip and stores it in PostgreSQL.

Example request:

```json
{
  "destination": "Japan",
  "days": 5,
  "budget": 2000,
  "travel_style": "Cultural"
}
```

The application automatically calculates:

- Daily budget
- Trip category
- Transportation recommendation

---

#### Read All — GET `/api/v1/trips`

Returns all trips stored in PostgreSQL.

Example response:

```json
[
  {
    "id": 1,
    "destination": "Japan",
    "days": 5,
    "budget": 2000,
    "category": "Standard",
    "daily_budget": 400
  }
]
```

---

#### Read One — GET `/api/v1/trips/{id}`

Returns a specific trip based on its ID.

Example:

```text
GET /api/v1/trips/1
```

If the trip does not exist, the API returns HTTP `404 Not Found`.

---

#### Update — PUT `/api/v1/trips/{id}`

Updates an existing trip.

Before saving the changes, the application recalculates:

- Trip category
- Daily budget
- Transportation recommendation

based on the new budget.

Example request:

```json
{
  "destination": "Bali",
  "days": 7,
  "budget": 7000,
  "travel_style": "Relaxing"
}
```

Example response:

```json
{
  "id": 1,
  "destination": "Bali",
  "days": 7,
  "budget": 7000,
  "daily_budget": 1000,
  "category": "Luxury",
  "travel_style": "Relaxing",
  "recommendation_transport": "Flight"
}
```

If the trip does not exist, the API returns HTTP `404 Not Found`.

---

#### Delete — DELETE `/api/v1/trips/{id}`

Deletes a trip from PostgreSQL based on its ID.

Example:

```text
DELETE /api/v1/trips/2
```

Successful response:

```json
{
  "message": "Trip with id 2 deleted successfully"
}
```

If the trip does not exist, the API returns HTTP `404 Not Found`.

---

## How to Run

Navigate to the backend directory:

```bash
cd backend
```

Activate the virtual environment if needed:

```powershell
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Make sure PostgreSQL is running and the required database configuration is available.

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

The API will be available at:

```text
http://localhost:8000
```

Interactive API documentation:

```text
http://localhost:8000/docs
```

Swagger UI can be used to test all available API endpoints.

---

## Git Version Control

### Session 1

```bash
git add .
git commit -m "Create initial KelanaAI console app"
git tag v0.1.0
git push origin v0.1.0
```

### Session 2

```bash
git add .
git commit -m "Add recommendation engine"
git push
git tag session-2
git push origin session-2
```

### Session 3

```bash
git add .
git commit -m "Convert KelanaAI into FastAPI"
git push
git tag session-3
git push origin session-3
```

### Session 4

```bash
git add .
git commit -m "Add PostgreSQL persistence"
git push
git tag session-4
git push origin session-4
```

---

## Current Status

- Session 1 — Completed
- Session 2 — Completed
- Session 3 — Completed
- Session 4 — Completed

KelanaAI currently provides:

- Travel information management
- Budget calculation
- Trip category classification
- Travel season detection
- Transportation recommendations
- Destination recommendations
- REST API endpoints
- PostgreSQL persistence
- SQLAlchemy ORM
- Trip CRUD operations
- API health check
- Interactive Swagger documentation

---

## Future Development

Future sessions will extend KelanaAI toward a more complete AI-powered travel planning system.

Potential future improvements include:

- Frontend application
- User authentication
- Advanced travel recommendations
- AI-powered itinerary generation
- More detailed destination data
- External travel APIs
- Improved database relationships
- Deployment to a production environment