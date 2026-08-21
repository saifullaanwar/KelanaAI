# KelanaAI

KelanaAI is a travel planning application built with Python during the AI Native Software Engineer Bootcamp.

The project is developed progressively from a simple console application into a REST API using FastAPI, with persistent data storage using PostgreSQL and SQLAlchemy ORM, and AI-powered travel itinerary generation using Amazon Bedrock.

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
│       ├── trip_service.py
│       └── bedrock_service.py
└── frontend/
    └── .gitkeep
```

### Description

- `backend/main.py` — FastAPI application and REST API endpoints.
- `backend/database.py` — PostgreSQL database connection and SQLAlchemy session configuration.
- `backend/models/trip.py` — SQLAlchemy Trip database model.
- `backend/services/trip_service.py` — contains the application's business logic.
- `backend/services/bedrock_service.py` — handles Amazon Bedrock configuration and AI-powered travel itinerary generation.
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
- AI recommendation

### ORM Model

The database model is defined in:

```text
backend/models/trip.py
```

The database connection and SQLAlchemy session are configured in:

```text
backend/database.py
```

The `Trip` model contains the following AI-related field:

```python
ai_recommendation = Column(Text, nullable=True)
```

This field stores the AI-generated travel itinerary returned by Amazon Bedrock.

### CRUD API

Session 4 completes the basic CRUD operations for trips.

#### Create — POST `/api/v1/trips`

Creates a new trip and stores it in PostgreSQL.

The application automatically calculates:

- Daily budget
- Trip category
- Transportation recommendation

#### Read All — GET `/api/v1/trips`

Returns all trips stored in PostgreSQL.

#### Read One — GET `/api/v1/trips/{id}`

Returns a specific trip based on its ID.

If the trip does not exist, the API returns HTTP `404 Not Found`.

#### Update — PUT `/api/v1/trips/{id}`

Updates an existing trip.

Before saving the changes, the application recalculates:

- Trip category
- Daily budget
- Transportation recommendation

#### Delete — DELETE `/api/v1/trips/{id}`

Deletes a trip from PostgreSQL based on its ID.

If the trip does not exist, the API returns HTTP `404 Not Found`.

---

# Session 5 — AI Travel Planner with Amazon Bedrock

Session 5 introduces generative AI into KelanaAI by integrating Amazon Bedrock.

The application evolves from a rule-based recommendation engine into an AI-powered travel planning system.

Instead of generating recommendations only from predefined business rules, KelanaAI sends trip information to an AI model through Amazon Bedrock and generates a personalized travel itinerary.

### Technologies

- Python
- FastAPI
- PostgreSQL
- SQLAlchemy
- Amazon Bedrock
- Amazon Nova Lite
- Boto3
- Python-dotenv
- Git & GitHub

### Amazon Bedrock Integration

The Amazon Bedrock integration is implemented in:

```text
backend/services/bedrock_service.py
```

The service is responsible for:

- Loading AWS configuration from environment variables
- Configuring the Bedrock Runtime client
- Connecting to Amazon Bedrock
- Sending travel information to the AI model
- Generating a personalized travel itinerary
- Returning the AI-generated recommendation

The application uses the following environment configuration:

```text
AWS_BEARER_TOKEN_BEDROCK
AWS_REGION
MODEL_ID
```

Sensitive AWS credentials are stored in `.env` and are not committed to Git.

### AI Model

KelanaAI currently uses:

```text
amazon.nova-lite-v1:0
```

The model is accessed through the Amazon Bedrock Runtime Converse API.

---

## Rich AI Prompt

The AI prompt provides the following trip information:

- Destination
- Number of Days
- Budget
- Travel Style

The prompt instructs the AI to generate a structured travel itinerary containing:

1. A daily itinerary for the entire trip.
2. An estimated daily budget.
3. Local food recommendations.
4. Transportation suggestions.
5. Recommended attractions and activities.
6. Morning activities with 2–3 activities per day.
7. Cultural sites and local experiences during the afternoon.
8. Dinner recommendations and nightlife activities during the evening.
9. Practical and realistic recommendations based on the specified budget and travel style.
10. Markdown-formatted output with clear headings and bullet lists.

The AI is instructed to format its response using Markdown:

```text
Format your response as Markdown with clear headings (##)
and bullet lists (-).
```

This allows the generated itinerary to be presented in a structured and readable format.

---

## AI Recommendation Endpoint

### POST `/api/v1/trips/{id}/generate`

Generates an AI-powered travel itinerary for an existing trip.

The endpoint:

1. Retrieves the trip from PostgreSQL.
2. Reads the destination, number of days, budget, and travel style.
3. Sends the trip information to Amazon Bedrock.
4. Receives the AI-generated itinerary.
5. Stores the recommendation in the `ai_recommendation` column.
6. Returns the generated recommendation to the API client.

Example:

```text
POST /api/v1/trips/5/generate
```

Example response:

```json
{
  "trip_id": 5,
  "destination": "japan",
  "recommendation": "# 5-Day Luxury Travel Itinerary for Japan\n\n## Day 1: Tokyo\n\n### Morning\n- Breakfast at a local restaurant\n- Visit a cultural landmark\n- Explore a traditional neighborhood\n\n### Afternoon\n- Visit a cultural site\n- Experience a local activity\n\n### Evening\n- Dinner at a local restaurant\n- Explore the local nightlife"
}
```

The exact response varies because the itinerary is generated dynamically by the AI model.

---

## AI Recommendation Persistence

The generated recommendation is stored in PostgreSQL using the following model field:

```python
ai_recommendation = Column(Text, nullable=True)
```

For example, after generating a recommendation, the `trips` table contains:

| Column | Example |
|---|---|
| `id` | `5` |
| `destination` | `japan` |
| `days` | `5` |
| `budget` | `8000` |
| `category` | `Luxury` |
| `daily_budget` | `1600` |
| `ai_recommendation` | Generated itinerary |

This means the AI recommendation remains available after the API request has finished.

---

## Markdown AI Response

The AI-generated itinerary is returned in Markdown format.

The generated response can contain:

- Main headings
- Daily itinerary sections
- Morning activities
- Afternoon activities
- Evening activities
- Budget information
- Transportation recommendations
- Food recommendations
- Attractions and activities

Example:

```markdown
# 5-Day Luxury Travel Itinerary for Japan

## Day 1: Tokyo

### Morning

- Visit Senso-ji Temple
- Explore Nakamise Shopping Street
- Have breakfast at a local bakery

### Afternoon

- Visit Tokyo National Museum
- Experience a traditional tea ceremony

### Evening

- Dinner at an authentic Izakaya
- Explore the local nightlife
```

The Markdown formatting is generated by the AI and stored directly in the database.

---

## Testing with Swagger UI

The AI recommendation endpoint can be tested using FastAPI Swagger UI.

Start the server:

```bash
uvicorn main:app --reload
```

Open:

```text
http://localhost:8000/docs
```

Then:

1. Find `POST /api/v1/trips/{id}/generate`.
2. Click **Try it out**.
3. Enter an existing trip ID.
4. Click **Execute**.
5. Verify the response status is `200`.
6. Check the generated AI recommendation.
7. Open PostgreSQL using DBeaver.
8. Open the `trips` table.
9. Verify that the `ai_recommendation` column contains the generated itinerary.

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

Configure the environment variables in `.env`:

```text
DATABASE_URL=your_database_url

AWS_BEARER_TOKEN_BEDROCK=your_bedrock_token
AWS_REGION=ap-southeast-2
MODEL_ID=amazon.nova-lite-v1:0
```

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

### Session 5

```bash
git add .
git commit -m "Enhance AI prompt and save recommendation to database"
git push
git tag session-5
git push origin session-5
```

---

## Current Status

- Session 1 — Completed
- Session 2 — Completed
- Session 3 — Completed
- Session 4 — Completed
- Session 5 — Completed

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
- Amazon Bedrock integration
- AI-powered travel itinerary generation
- Rich AI prompt engineering
- Structured daily travel plans
- Markdown-formatted AI responses
- AI recommendation persistence in PostgreSQL

---

## Future Development

Future sessions can extend KelanaAI toward a more complete AI-powered travel planning platform.

Potential improvements include:

- Next.js frontend application
- Interactive AI itinerary interface
- User authentication
- User trip history
- Advanced destination data
- External travel APIs
- Real-time weather information
- Hotel and flight integrations
- Improved database relationships
- AI itinerary refinement
- Production deployment
- Cloud infrastructure