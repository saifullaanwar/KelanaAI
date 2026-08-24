# KelanaAI

KelanaAI is an AI-powered travel planning application built with Python during the AI Native Software Engineer Bootcamp.

The project is developed progressively from a simple console application into a full-stack travel planning platform using:

- Python
- FastAPI
- PostgreSQL
- SQLAlchemy
- Amazon Bedrock
- Next.js
- React
- TypeScript
- Tailwind CSS

KelanaAI allows users to enter their destination, budget, number of days, and travel style through a web interface. The backend processes the request, generates an AI-powered itinerary using Amazon Bedrock, and stores the generated recommendation in PostgreSQL.

---

## Project Evolution

KelanaAI has been developed progressively through multiple sessions:

| Session | Focus | Status |
|---|---|---|
| Session 1 | Python Console Application | Completed |
| Session 2 | Recommendation Engine | Completed |
| Session 3 | FastAPI REST API | Completed |
| Session 4 | PostgreSQL Persistence & CRUD | Completed |
| Session 5 | Amazon Bedrock AI Integration | Completed |
| Session 6 | Next.js Frontend | Completed |

The application has evolved from a simple command-line travel calculator into a full-stack AI travel planning application.

---

# Project Structure

```text
kelana-ai/

├── README.md
├── .gitignore
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── requirements.txt
│   ├── .env
│   │
│   ├── models/
│   │   └── trip.py
│   │
│   └── services/
│       ├── trip_service.py
│       └── bedrock_service.py
│
└── frontend/
    ├── .env.local
    ├── package.json
    ├── package-lock.json
    ├── next.config.ts
    ├── tsconfig.json
    ├── postcss.config.mjs
    ├── eslint.config.mjs
    │
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── page.tsx
    │   │
    │   └── components/
    │       └── TravelGlobe.tsx
    │
    └── public/
```

---

# Architecture

KelanaAI follows a layered full-stack architecture.

```text
┌──────────────────────┐
│        User          │
│      Browser         │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│     Next.js          │
│      Frontend        │
│                      │
│ React + TypeScript   │
│ Tailwind CSS         │
│ Lucide React         │
│ Three.js             │
│ React Markdown       │
└──────────┬───────────┘
           │
           │ HTTP / JSON
           ▼
┌──────────────────────┐
│       FastAPI        │
│       Backend        │
│                      │
│ Business Logic       │
│ REST API             │
└───────┬────────┬─────┘
        │        │
        │        ▼
        │   ┌───────────────┐
        │   │ Amazon        │
        │   │ Bedrock       │
        │   │               │
        │   │ Nova Lite AI  │
        │   └───────────────┘
        │
        ▼
┌──────────────────────┐
│     PostgreSQL       │
│                      │
│ Trip Data            │
│ AI Recommendation    │
└──────────────────────┘
```

The frontend never communicates directly with Amazon Bedrock.

The communication flow is:

```text
User
  ↓
Next.js
  ↓
FastAPI
  ↓
Amazon Bedrock
  ↓
AI Recommendation
  ↓
PostgreSQL
  ↓
FastAPI
  ↓
Next.js
  ↓
Browser
```

---

# Backend

The backend is built with Python and FastAPI.

## Backend Technologies

- Python
- FastAPI
- Uvicorn
- Pydantic
- PostgreSQL
- SQLAlchemy
- Amazon Bedrock
- Amazon Nova Lite
- Boto3
- Python-dotenv

---

# Session 1 — Trip Summary Generator

The first version of KelanaAI introduced the fundamentals of Python programming.

## Features

- Interactive user input
- Variables and data types
- Type conversion using `int()` and `float()`
- Functions and parameters
- f-string formatting
- Basic conditional logic
- Git and GitHub workflow

## Trip Information

The application collects:

- Destination
- Country
- Days
- Budget
- Currency
- Travel Month

---

# Session 2 — Recommendation Engine

Session 2 makes KelanaAI smarter by introducing business logic, recommendations, lists, loops, and modular architecture.

## Features

- Trip category calculation
- Daily budget calculation
- Transportation recommendation
- Travel season detection
- Recommended places
- Multiple destinations
- Lists and loops
- Layered architecture

## Trip Category

| Budget | Category |
|---|---|
| `< 1000` | Backpacker |
| `1000 - 3000` | Standard |
| `> 3000` | Luxury |

## Transportation

| Category | Recommendation |
|---|---|
| Backpacker | Bus |
| Standard | Train |
| Luxury | Flight |

## Travel Season

| Month | Season |
|---|---|
| December | Peak Season |
| June | Holiday Season |
| Other months | Regular Season |

---

# Session 3 — REST API with FastAPI

Session 3 transforms KelanaAI from a console application into a REST API using FastAPI and Uvicorn.

The API reuses the business logic from `trip_service.py`.

## Technologies

- Python
- FastAPI
- Uvicorn
- Pydantic
- Git & GitHub

## API Endpoints

### GET `/`

Returns a welcome message.

```json
{
  "message": "Welcome to KelanaAI"
}
```

### GET `/health`

Returns the API health status.

```json
{
  "status": "OK"
}
```

### POST `/api/v1/trips`

Creates a new trip recommendation.

Example request:

```json
{
  "destination": "Japan",
  "days": 5,
  "budget": 2000,
  "travel_style": "Cultural"
}
```

The backend automatically calculates:

- Daily budget
- Trip category
- Transportation recommendation
- AI itinerary

---

### GET `/api/v1/trip-categories`

Returns available trip categories.

```json
[
  "Backpacker",
  "Standard",
  "Luxury"
]
```

### GET `/api/v1/recommendations`

Returns recommended destinations.

```json
[
  "Tokyo Tower",
  "Mount Fuji",
  "Shibuya"
]
```

### GET `/api/v1/transportations`

Returns available transportation recommendations.

```json
[
  "Bus",
  "Train",
  "Flight"
]
```

---

# Session 4 — PostgreSQL Persistence

Session 4 introduces persistent data storage to KelanaAI.

The application is no longer stateless. Trip data is stored permanently in PostgreSQL using SQLAlchemy ORM.

## Technologies

- Python
- FastAPI
- Uvicorn
- Pydantic
- PostgreSQL
- SQLAlchemy
- Git & GitHub

## Database

KelanaAI uses PostgreSQL as its persistent database.

The `trips` table stores:

- Trip ID
- Destination
- Number of days
- Budget
- Trip category
- Daily budget
- AI recommendation

## ORM Model

The database model is defined in:

```text
backend/models/trip.py
```

The database connection and SQLAlchemy session are configured in:

```text
backend/database.py
```

The AI recommendation is stored using:

```python
ai_recommendation = Column(Text, nullable=True)
```

---

# CRUD API

Session 4 completes the basic CRUD operations for trips.

## Create

### POST `/api/v1/trips`

Creates a new trip and stores it in PostgreSQL.

The application automatically calculates:

- Daily budget
- Trip category
- Transportation recommendation
- AI recommendation

---

## Read All

### GET `/api/v1/trips`

Returns all trips stored in PostgreSQL.

---

## Read One

### GET `/api/v1/trips/{id}`

Returns a specific trip based on its ID.

If the trip does not exist, the API returns:

```text
404 Not Found
```

---

## Update

### PUT `/api/v1/trips/{id}`

Updates an existing trip.

Before saving the changes, the application recalculates:

- Trip category
- Daily budget
- Transportation recommendation

---

## Delete

### DELETE `/api/v1/trips/{id}`

Deletes a trip from PostgreSQL based on its ID.

If the trip does not exist, the API returns:

```text
404 Not Found
```

---

# Session 5 — AI Travel Planner with Amazon Bedrock

Session 5 introduces generative AI into KelanaAI by integrating Amazon Bedrock.

The application evolves from a rule-based recommendation engine into an AI-powered travel planning system.

Instead of generating recommendations only from predefined business rules, KelanaAI sends trip information to an AI model through Amazon Bedrock and generates a personalized travel itinerary.

## Technologies

- Python
- FastAPI
- PostgreSQL
- SQLAlchemy
- Amazon Bedrock
- Amazon Nova Lite
- Boto3
- Python-dotenv
- Git & GitHub

## Amazon Bedrock Integration

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

## Environment Variables

Backend configuration is stored in `.env`.

Example:

```env
DATABASE_URL=your_database_url

AWS_BEARER_TOKEN_BEDROCK=your_bedrock_token
AWS_REGION=ap-southeast-2
MODEL_ID=amazon.nova-lite-v1:0
```

Sensitive credentials must not be committed to Git.

---

# AI Model

KelanaAI currently uses:

```text
amazon.nova-lite-v1:0
```

The model is accessed through the Amazon Bedrock Runtime Converse API.

---

# Rich AI Prompt

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
6. Morning activities.
7. Cultural sites and local experiences.
8. Dinner recommendations and evening activities.
9. Practical recommendations based on the specified budget and travel style.
10. Markdown-formatted output with clear headings and bullet lists.

The AI is instructed to format its response using Markdown.

This allows the generated itinerary to be displayed as structured content in the frontend.

---

# AI Recommendation Endpoint

### POST `/api/v1/trips/{id}/generate`

Generates an AI-powered travel itinerary for an existing trip.

The endpoint:

1. Retrieves the trip from PostgreSQL.
2. Reads the destination, number of days, budget, and travel style.
3. Sends the trip information to Amazon Bedrock.
4. Receives the AI-generated itinerary.
5. Stores the recommendation in the `ai_recommendation` column.
6. Returns the generated recommendation.

Example:

```text
POST /api/v1/trips/5/generate
```

---

# AI Recommendation Persistence

The generated recommendation is stored in PostgreSQL using:

```python
ai_recommendation = Column(Text, nullable=True)
```

Example database record:

| Column | Example |
|---|---|
| `id` | `5` |
| `destination` | `japan` |
| `days` | `5` |
| `budget` | `8000` |
| `category` | `Luxury` |
| `daily_budget` | `1600` |
| `ai_recommendation` | Generated itinerary |

The recommendation remains available after the API request has finished.

---

# Session 6 — Next.js Frontend

Session 6 gives KelanaAI its first real user interface.

Previously, users interacted with the backend through Swagger UI or HTTP requests.

Now users can interact with KelanaAI directly through a web application.

## Goal

The goal of Session 6 is to create a user-friendly frontend that:

- Collects trip information
- Sends requests to FastAPI
- Displays loading feedback
- Handles API errors gracefully
- Displays AI-generated travel itineraries
- Renders AI Markdown as formatted HTML
- Provides a polished travel-planning experience

---

# Frontend Technologies

Session 6 introduces the following technologies:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide React
- Three.js
- React Three Fiber
- React Three Drei
- React Markdown
- Next.js App Router

---

# Next.js Frontend

The frontend is located in:

```text
frontend/
```

The main application page is:

```text
frontend/app/page.tsx
```

Global styling is defined in:

```text
frontend/app/globals.css
```

The Three.js travel globe component is located at:

```text
frontend/app/components/TravelGlobe.tsx
```

---

# Frontend Environment Configuration

The frontend uses a local environment file:

```text
frontend/.env.local
```

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

The frontend uses this environment variable when communicating with FastAPI.

Example:

```typescript
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";
```

The frontend then calls:

```text
POST ${API_URL}/api/v1/trips
```

This avoids hardcoding the backend URL throughout the application.

> `.env.local` should remain local and should not be committed to Git.

---

# Frontend User Flow

The user flow is now:

```text
1. Open KelanaAI
       ↓
2. Enter destination
       ↓
3. Enter budget
       ↓
4. Enter number of days
       ↓
5. Select travel style
       ↓
6. Click "Generate My Trip"
       ↓
7. Frontend sends JSON to FastAPI
       ↓
8. FastAPI processes the request
       ↓
9. Amazon Bedrock generates itinerary
       ↓
10. Recommendation is stored in PostgreSQL
       ↓
11. FastAPI returns JSON
       ↓
12. Next.js receives the response
       ↓
13. React renders the itinerary
```

---

# Frontend Form

The homepage contains a travel planning form.

## Fields

### Destination

Example:

```text
Japan
```

### Budget

Example:

```text
2000
```

### Days

Example:

```text
5
```

### Travel Style

Available styles include:

- Backpacker
- Family
- Adventure
- Cultural
- Relaxing
- Luxury

---

# API Communication

The frontend uses the browser's built-in `fetch()` API.

Example:

```typescript
const response = await fetch(
  `${API_URL}/api/v1/trips`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      destination,
      budget: Number(budget),
      days: Number(days),
      travel_style: travelStyle,
    }),
  }
);
```

The backend does not need to change when the request comes from Next.js.

FastAPI continues to receive a standard HTTP request containing JSON.

---

# CORS Configuration

Because the frontend and backend run on different ports during development:

```text
Frontend → http://localhost:3000

Backend → http://localhost:8000
```

FastAPI is configured with CORS middleware to allow the Next.js frontend to communicate with the backend.

Example:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

# React Markdown

Amazon Bedrock returns the itinerary in Markdown format.

For example:

```markdown
# 5-Day Family Travel Itinerary to Japan

## Day 1: Tokyo

### Morning

- Visit Senso-ji Temple
- Explore Nakamise Shopping Street
- Have breakfast at a local café

### Afternoon

- Visit Tokyo National Museum
- Explore Ueno Park

### Evening

- Dinner at a local restaurant
- Explore Tokyo nightlife
```

The frontend uses `react-markdown` to convert the Markdown into readable UI elements.

The package is installed with:

```bash
npm install react-markdown
```

This allows headings, lists, bold text, paragraphs, and other Markdown elements to be rendered properly instead of displaying raw Markdown syntax.

---

# Loading State

Generating an AI itinerary can take several seconds.

Session 6 introduces a loading state so users receive immediate visual feedback.

When the user generates a trip, the button changes from:

```text
Generate My Trip
```

to:

```text
Creating your itinerary...
```

A loading spinner is displayed while waiting for Amazon Bedrock.

The purpose is to make the AI generation process feel intentional rather than making the application appear frozen.

---

# Error Handling

The frontend also handles failed API requests.

If the backend is unavailable or the request fails, users receive a friendly message instead of seeing a broken interface.

Example:

```text
We couldn't generate your itinerary right now.
Please make sure the backend is running and try again.
```

The implementation uses `try/catch` around the API request.

Example:

```typescript
try {
  const response = await fetch(...);

  if (!response.ok) {
    throw new Error(
      `Request failed with status ${response.status}`
    );
  }

  const data = await response.json();

  setTrip(data);
} catch (error) {
  setError(
    "We couldn't generate your itinerary right now."
  );
}
```

---

# UI Design

Session 6 introduces a modern dark travel-planning interface.

The frontend uses:

- Dark navy background
- Cyan and blue accent colors
- Glassmorphism panels
- Gradient typography
- Responsive form controls
- Rounded cards
- Subtle glow effects
- Background grid
- AI status indicators
- Custom scrollbars

The visual design is intended to make KelanaAI feel like a modern AI product rather than a basic CRUD application.

---

# Three.js Travel Globe

The homepage includes an interactive visual element created with Three.js.

The globe component is implemented using:

```text
@react-three/fiber
@react-three/drei
three
```

The component is located at:

```text
frontend/app/components/TravelGlobe.tsx
```

The globe provides visual identity to the homepage and reinforces the travel-focused theme.

The frontend installation:

```bash
npm install lucide-react three @react-three/fiber @react-three/drei
```

---

# Lucide React

KelanaAI uses Lucide React for interface icons.

Examples include:

- Compass
- Map Pin
- Dollar Sign
- Users
- Sparkles
- Check
- Arrow Right
- Loading Spinner

The package is installed with:

```bash
npm install lucide-react
```

Using an icon library keeps the UI consistent and avoids manually creating SVG icons.

---

# Responsive Design

The frontend is designed to work across different screen sizes.

On larger screens, the homepage uses a two-column layout:

```text
┌───────────────────────────┬──────────────────────┐
│                           │                      │
│       Hero Section        │    Trip Planner      │
│                           │       Form           │
│   Your next adventure     │                      │
│      starts here.         │                      │
│                           │                      │
└───────────────────────────┴──────────────────────┘
```

The interface adapts to smaller screens while maintaining the core travel-planning functionality.

The itinerary itself has an internal scroll area so long AI-generated responses do not break the main application layout.

---

# Result Interface

After generating a trip, the frontend displays:

- Destination
- Total budget
- Daily budget
- Trip category
- Transportation recommendation
- AI itinerary

Example:

```text
YOUR TRIP PLAN

Japan
5-day Family journey

Budget       Daily       Category
$2,000       $400        Standard

Transport
Train

AI ITINERARY

5-Day Family Travel Itinerary to Japan

Day 1: Tokyo
...

Day 2: Kyoto
...

Day 3: Kyoto
...
```

The itinerary is displayed inside a dedicated scrollable content area.

---

# Plan Another Trip

After viewing an itinerary, users can select:

```text
Plan Another Trip
```

This resets the current result and returns the user to the travel planning form.

---

# How to Run

KelanaAI requires two development servers:

```text
Backend  → http://localhost:8000
Frontend → http://localhost:3000
```

Both should be running at the same time.

---

# Run Backend

Open a terminal and navigate to:

```powershell
cd D:\kelana-ai\backend
```

Activate the virtual environment:

```powershell
.venv\Scripts\activate
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

Make sure PostgreSQL is running.

Make sure the backend `.env` contains the required configuration:

```env
DATABASE_URL=your_database_url

AWS_BEARER_TOKEN_BEDROCK=your_bedrock_token
AWS_REGION=ap-southeast-2
MODEL_ID=amazon.nova-lite-v1:0
```

Start FastAPI:

```powershell
uvicorn main:app --reload
```

The backend will be available at:

```text
http://localhost:8000
```

Swagger UI:

```text
http://localhost:8000/docs
```

---

# Run Frontend

Open another terminal.

Navigate to:

```powershell
cd D:\kelana-ai\frontend
```

Install dependencies:

```powershell
npm install
```

Make sure:

```text
frontend/.env.local
```

contains:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start Next.js:

```powershell
npm run dev
```

The frontend will be available at:

```text
http://localhost:3000
```

---

# Development Workflow

Run both servers:

### Terminal 1 — Backend

```powershell
cd backend
.venv\Scripts\activate
uvicorn main:app --reload
```

### Terminal 2 — Frontend

```powershell
cd frontend
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

# Git Version Control

KelanaAI uses Git tags to mark the progress of each development session.

## Session 1

```bash
git add .
git commit -m "Create initial KelanaAI console app"
git tag v0.1.0
git push origin v0.1.0
```

## Session 2

```bash
git add .
git commit -m "Add recommendation engine"
git push
git tag session-2
git push origin session-2
```

## Session 3

```bash
git add .
git commit -m "Convert KelanaAI into FastAPI"
git push
git tag session-3
git push origin session-3
```

## Session 4

```bash
git add .
git commit -m "Add PostgreSQL persistence"
git push
git tag session-4
git push origin session-4
```

## Session 5

```bash
git add .
git commit -m "Enhance AI prompt and save recommendation to database"
git push
git tag session-5
git push origin session-5
```

## Session 6

Recommended Git checkpoint:

```bash
git add .
git commit -m "Create Next.js frontend"
git push
git tag session-6
git push origin session-6
```

---

# Current Git Tags

The project currently contains the following development tags:

```text
v0.1.0
session-2
session-3
session-4
session-5
session-6
```

---

# Current Status

## Backend

- Session 1 — Completed
- Session 2 — Completed
- Session 3 — Completed
- Session 4 — Completed
- Session 5 — Completed

## Frontend

- Session 6 — Completed

KelanaAI currently provides:

- Travel information management
- Budget calculation
- Daily budget calculation
- Trip category classification
- Travel season detection
- Transportation recommendations
- Destination recommendations
- REST API
- PostgreSQL persistence
- SQLAlchemy ORM
- Trip CRUD operations
- API health check
- Interactive Swagger documentation
- Amazon Bedrock integration
- Amazon Nova Lite integration
- AI-powered travel itinerary generation
- Rich AI prompt engineering
- Structured daily travel plans
- Markdown-formatted AI responses
- AI recommendation persistence in PostgreSQL
- Next.js frontend
- React UI
- TypeScript
- Tailwind CSS
- Responsive travel planning interface
- Loading state
- Error handling
- React Markdown rendering
- Lucide React icons
- Three.js travel visualization
- Frontend-to-backend API integration
- Frontend environment configuration

---

# Session 6 Achievement

Before Session 6:

```text
User
  ↓
Swagger UI
  ↓
FastAPI
  ↓
Amazon Bedrock
```

After Session 6:

```text
User
  ↓
Next.js Web Interface
  ↓
FastAPI
  ↓
Amazon Bedrock
  ↓
PostgreSQL
  ↓
AI Itinerary
  ↓
Next.js
  ↓
User
```

KelanaAI is no longer only an API.

It now has a real user interface through which users can interact with the AI travel planner.

---

# Future Development

Future sessions can extend KelanaAI toward a more complete AI-powered travel planning platform.

Potential improvements include:

- User authentication
- User registration and login
- User trip history
- Saved trips dashboard
- Browse previously generated itineraries
- Edit saved trips
- Delete saved trips from the frontend
- AI itinerary refinement
- Regenerate specific days
- More detailed destination information
- External travel APIs
- Real-time weather information
- Hotel integrations
- Flight integrations
- Maps integration
- Interactive destination maps
- Improved database relationships
- Production deployment
- Cloud infrastructure
- Frontend deployment
- Backend deployment
- CI/CD pipeline
- Monitoring and logging

---

# Learning Progression

KelanaAI demonstrates a progressive software engineering learning path:

```text
Python Fundamentals
        ↓
Business Logic
        ↓
REST API
        ↓
PostgreSQL
        ↓
SQLAlchemy ORM
        ↓
Amazon Bedrock
        ↓
AI Prompt Engineering
        ↓
Next.js
        ↓
React + TypeScript
        ↓
Tailwind CSS
        ↓
REST API Integration
        ↓
AI Markdown Rendering
        ↓
Loading & Error Handling
        ↓
Interactive UI
```

The project demonstrates how a simple Python application can progressively evolve into a full-stack AI-powered product.