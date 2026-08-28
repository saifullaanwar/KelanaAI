# KelanaAI

KelanaAI is an AI-powered travel planning application built with Python during the AI Native Software Engineer Bootcamp.

The project is developed progressively from a simple console application into a full-stack AI travel planning platform using:

- Python
- FastAPI
- PostgreSQL
- SQLAlchemy
- Amazon Bedrock
- Amazon Nova Lite
- Boto3
- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide React
- Three.js
- React Three Fiber
- React Three Drei
- React Markdown
- JWT Authentication
- bcrypt

KelanaAI allows users to enter their destination, budget, number of days, and travel style through a web interface.

The backend processes the request, generates an AI-powered itinerary using Amazon Bedrock, and stores the generated recommendation in PostgreSQL.

The application also provides user authentication, profile management, personalized navigation, and user-specific travel history.

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
| Session 7 | Trip History Dashboard & Enhanced Trip Cards | Completed |
| Session 8 | User Authentication, Profile & Personalized Navigation | Completed |

The application has evolved from a simple command-line travel calculator into a full-stack AI travel planning platform with:

- AI-powered itinerary generation
- PostgreSQL persistence
- Trip history
- Trip detail pages
- Search and sorting
- Pagination
- User registration
- User login
- JWT authentication
- User profile
- User-specific trip history
- Personalized navigation
- Logout functionality
- Personalized welcome message

---

## Project Structure

```text
kelana-ai/
│
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
│   │   ├── trip.py
│   │   └── user.py
│   │
│   └── services/
│       ├── trip_service.py
│       ├── bedrock_service.py
│       └── auth_service.py
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
    │   ├── components/
    │   │   └── TravelGlobe.tsx
    │   │
    │   ├── login/
    │   │   └── page.tsx
    │   │
    │   ├── register/
    │   │   └── page.tsx
    │   │
    │   ├── profile/
    │   │   └── page.tsx
    │   │
    │   └── trips/
    │       ├── page.tsx
    │       │
    │       └── [id]/
    │           ├── page.tsx
    │           └── _components/
    │               ├── ItineraryView.tsx
    │               └── itineraryParser.ts
    │
    ├── components/
    │   ├── AuthNav.tsx
    │   ├── LogoutButton.tsx
    │   ├── TripCard.tsx
    │   └── TripHistoryClient.tsx
    │
    ├── services/
    │   ├── authService.ts
    │   └── tripService.ts
    │
    ├── types/
    │   └── trip.ts
    │
    └── public/
```

---

# Architecture

KelanaAI follows a layered full-stack architecture.

```text
┌──────────────────────────────┐
│            User              │
│          Browser             │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│          Next.js             │
│          Frontend            │
│                              │
│ React + TypeScript           │
│ Tailwind CSS                 │
│ Lucide React                 │
│ Three.js                     │
│ React Markdown               │
└──────────────┬───────────────┘
               │
               │ HTTP / JSON
               ▼
┌──────────────────────────────┐
│           FastAPI            │
│           Backend            │
│                              │
│ REST API                     │
│ Business Logic               │
│ Authentication               │
│ JWT                          │
└───────┬──────────────┬───────┘
        │              │
        │              ▼
        │      ┌─────────────────┐
        │      │ Amazon Bedrock  │
        │      │                 │
        │      │ Nova Lite AI    │
        │      └─────────────────┘
        │
        ▼
┌──────────────────────────────┐
│          PostgreSQL          │
│                              │
│ Users                        │
│ Trips                        │
│ AI Recommendations           │
└──────────────────────────────┘
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

For authentication:

```text
User
  ↓
Login / Register
  ↓
Next.js
  ↓
FastAPI
  ↓
PostgreSQL
  ↓
JWT
  ↓
Browser localStorage
  ↓
Authenticated API Requests
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
- bcrypt
- python-jose
- JWT

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

Example:

```json
{
  "message": "Welcome to KelanaAI"
}
```

### GET `/health`

Returns the API health status.

Example:

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

### GET `/api/v1/transportations`

Returns available transportation recommendations.

---

# Session 4 — PostgreSQL Persistence

Session 4 introduces persistent data storage to KelanaAI.

The application is no longer stateless.

Trip data is stored permanently in PostgreSQL using SQLAlchemy ORM.

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

The `users` table stores authenticated user information.

---

# ORM Models

Trip model:

```text
backend/models/trip.py
```

User model:

```text
backend/models/user.py
```

Database connection:

```text
backend/database.py
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

## Read All

### GET `/api/v1/trips`

Returns trips stored in PostgreSQL.

## Read One

### GET `/api/v1/trips/{id}`

Returns a specific trip based on its ID.

## Update

### PUT `/api/v1/trips/{id}`

Updates an existing trip.

Before saving the changes, the application recalculates:

- Trip category
- Daily budget
- Transportation recommendation

## Delete

### DELETE `/api/v1/trips/{id}`

Deletes a trip from PostgreSQL based on its ID.

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

---

# Amazon Bedrock Integration

The Amazon Bedrock integration is implemented in:

```text
backend/services/bedrock_service.py
```

The service is responsible for:

- Loading AWS configuration
- Configuring the Bedrock Runtime client
- Connecting to Amazon Bedrock
- Sending travel information to the AI model
- Generating a personalized travel itinerary
- Returning the AI-generated recommendation

---

# Environment Variables

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
5. Stores the recommendation in PostgreSQL.
6. Returns the generated recommendation.

Example:

```text
POST /api/v1/trips/5/generate
```

---

# AI Recommendation Persistence

The generated recommendation is stored in PostgreSQL.

Example:

| Column | Example |
|---|---|
| `id` | `5` |
| `destination` | `Japan` |
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

## Goals

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

The application layout is defined in:

```text
frontend/app/layout.tsx
```

The Three.js travel globe component is located at:

```text
frontend/app/components/TravelGlobe.tsx
```

---

# Frontend Environment Configuration

The frontend uses:

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

---

# Frontend User Flow

The main user flow is:

```text
1. Open KelanaAI
       ↓
2. Register / Login
       ↓
3. Enter destination
       ↓
4. Enter budget
       ↓
5. Enter number of days
       ↓
6. Select travel style
       ↓
7. Click "Generate My Trip"
       ↓
8. Frontend sends JSON to FastAPI
       ↓
9. FastAPI processes the request
       ↓
10. Amazon Bedrock generates itinerary
       ↓
11. Recommendation is stored in PostgreSQL
       ↓
12. FastAPI returns JSON
       ↓
13. Next.js receives the response
       ↓
14. React renders the itinerary
       ↓
15. Trip becomes available in Trip History
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

The backend continues to receive a standard HTTP request containing JSON.

---

# CORS Configuration

Because the frontend and backend run on different ports during development:

```text
Frontend → http://localhost:3000

Backend → http://localhost:8000
```

FastAPI is configured with CORS middleware to allow the Next.js frontend to communicate with the backend.

---

# React Markdown

Amazon Bedrock returns the itinerary in Markdown format.

Example:

```markdown
# 5-Day Family Travel Itinerary to Japan

## Day 1: Tokyo

### Morning

- Visit Senso-ji Temple
- Explore Nakamise Shopping Street

### Afternoon

- Visit Tokyo National Museum
- Explore Ueno Park

### Evening

- Dinner at a local restaurant
```

The frontend uses `react-markdown` to convert the Markdown into readable UI elements.

This allows headings, lists, bold text, paragraphs, and other Markdown elements to be rendered properly.

---

# Loading State

Generating an AI itinerary can take several seconds.

KelanaAI provides a loading state so users receive immediate visual feedback.

The button changes from:

```text
Generate My Trip
```

to:

```text
Creating your itinerary...
```

A loading spinner is displayed while waiting for Amazon Bedrock.

---

# Error Handling

The frontend handles failed API requests.

If the backend is unavailable or the request fails, users receive a friendly message instead of seeing a broken interface.

The implementation uses `try/catch` around API requests.

---

# UI Design

KelanaAI uses a modern dark travel-planning interface.

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
- Travel-focused visual elements

The visual design is intended to make KelanaAI feel like a modern AI product rather than a basic CRUD application.

---

# Three.js Travel Globe

The homepage includes an interactive visual element created with Three.js.

The globe component uses:

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
- User
- Login
- Logout
- User Plus
- History

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

---

# Plan Another Trip

After viewing an itinerary, users can select:

```text
Plan Another Trip
```

This resets the current result and returns the user to the travel planning form.

---

# Session 7 — Trip History Dashboard

Session 7 transforms KelanaAI from a single-page travel planner into a multi-page application with persistent trip history.

The frontend connects the existing PostgreSQL and FastAPI backend to a dedicated Trip History Dashboard.

## Goals

The goal of Session 7 is to:

- Retrieve saved trips from PostgreSQL through FastAPI
- Display previously generated trips
- Create a dedicated Trip History Dashboard
- Create individual Trip Detail pages
- Improve Trip Card presentation
- Add search and sorting
- Add pagination
- Display richer trip metadata
- Parse and structure AI-generated itineraries
- Improve the readability of long AI recommendations

---

# Trip History Dashboard

The Trip History Dashboard is available at:

```text
/trips
```

The page retrieves saved trips from:

```text
GET /api/v1/trips
```

The dashboard displays saved itineraries as individual Trip Cards.

Each card provides a concise overview of the trip and a link to its detail page.

---

# Trip Detail Page

Each saved trip can be opened through:

```text
/trips/{id}
```

The page retrieves the selected trip through:

```text
GET /api/v1/trips/{id}
```

The Trip Detail page displays:

- Destination
- Total budget
- Daily budget
- Duration
- Trip category
- Transportation recommendation
- AI-generated itinerary

---

# Trip Card

Trip Cards are implemented in:

```text
frontend/components/TripCard.tsx
```

Each Trip Card provides:

- Destination
- Destination icon or country flag
- Trip duration
- Budget
- Currency formatting
- Category badge
- Travel style badge
- View Details action

---

# Search & Sorting

The Trip History Dashboard supports searching and sorting.

Search can match against:

- Destination
- Category
- Travel style

Example searches:

```text
Japan
Luxury
Family
```

The dashboard supports sorting by:

- Latest
- Oldest
- Highest Budget
- Lowest Budget

The search and sorting controls are implemented in:

```text
frontend/components/TripHistoryClient.tsx
```

---

# Pagination

The Trip History Dashboard includes pagination when the number of saved trips exceeds the page limit.

The dashboard displays:

```text
10 trips per page
```

Users can navigate using:

- Previous
- Page numbers
- Next

The pagination automatically resets to page 1 when search or sorting criteria change.

---

# Structured AI Itinerary

Long AI-generated Markdown responses are parsed into structured sections.

The parser is implemented in:

```text
frontend/app/trips/[id]/_components/itineraryParser.ts
```

The parsed structure separates the itinerary into:

```text
Trip
 ├── Day 1
 │    ├── Morning
 │    ├── Afternoon
 │    └── Evening
 │
 ├── Day 2
 │    ├── Morning
 │    ├── Afternoon
 │    └── Evening
 │
 └── ...
```

This makes long AI-generated itineraries easier to read and understand.

---

# Day-by-Day Itinerary

The structured itinerary is displayed through:

```text
frontend/app/trips/[id]/_components/ItineraryView.tsx
```

Each day is presented as an individual card.

The day card contains:

- Day number
- Day title
- Morning activities
- Afternoon activities
- Evening activities

---

# Itinerary Activity Cards

Activities inside each time slot can display structured information such as:

- Activity title
- Description
- Location
- Estimated cost
- Additional information when available

This allows the AI-generated itinerary to be presented as a readable travel plan instead of a large Markdown document.

---

# General Tips

Information that applies to the entire trip is separated from individual days.

Examples include:

- Transportation suggestions
- Accommodation recommendations
- Local etiquette
- Currency information
- Other general travel tips

---

# Trip Summary

The Trip Detail page can display a final Trip Summary containing:

- Budget-related information
- Overall trip information
- AI-generated closing notes

The summary is kept separate from individual itinerary days because it describes the trip as a whole.

---

# Session 8 — Authentication & User Profile

Session 8 introduces user authentication and personalization.

KelanaAI now supports:

- User registration
- User login
- JWT authentication
- Password hashing
- Current user retrieval
- User profile page
- Personalized navbar
- Personalized welcome message
- Logout
- Authentication-aware navigation
- User-specific trip information

This transforms KelanaAI from a shared travel planning application into a personalized travel platform.

---

# Authentication Architecture

The authentication flow is:

```text
┌──────────────┐
│     User     │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ Next.js Login    │
│ /login           │
└────────┬─────────┘
         │
         │ POST /api/v1/auth/login
         ▼
┌──────────────────┐
│ FastAPI Backend  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ PostgreSQL       │
│ Users            │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Verify Password  │
│ bcrypt           │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Generate JWT     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Next.js          │
│ localStorage     │
└──────────────────┘
```

---

# Authentication Technologies

Session 8 introduces:

- JWT
- bcrypt
- python-jose
- FastAPI authentication dependencies
- localStorage
- React state
- Custom browser authentication events

---

# User Model

Authenticated users are stored in PostgreSQL.

The user model is located at:

```text
backend/models/user.py
```

The user contains information such as:

- User ID
- Name
- Email
- Password hash

Passwords are never stored as plain text.

---

# Password Hashing

Passwords are hashed using bcrypt before being stored.

Example:

```python
bcrypt.hashpw(
    password.encode("utf-8"),
    bcrypt.gensalt()
)
```

During login, the password is verified using bcrypt.

```python
bcrypt.checkpw(
    password.encode("utf-8"),
    user.password_hash.encode("utf-8")
)
```

This prevents plain-text passwords from being stored in the database.

---

# Authentication Service

Authentication business logic is implemented in:

```text
backend/services/auth_service.py
```

The service is responsible for:

- Registering users
- Checking existing email addresses
- Hashing passwords
- Verifying login credentials
- Generating JWT access tokens

---

# JWT Authentication

After successful login, the backend generates a JWT.

The JWT contains the user's ID:

```python
{
    "sub": str(user.id),
}
```

The token is returned to the frontend:

```json
{
  "access_token": "JWT_TOKEN",
  "token_type": "bearer"
}
```

The frontend stores the token in:

```text
localStorage
```

using the key:

```text
access_token
```

---

# Authentication API

## POST `/api/v1/auth/register`

Registers a new user.

Example request:

```json
{
  "name": "Alice",
  "email": "alice@email.com",
  "password": "password123"
}
```

---

# Login API

## POST `/api/v1/auth/login`

Authenticates an existing user.

Example request:

```json
{
  "email": "alice@email.com",
  "password": "password123"
}
```

Example response:

```json
{
  "access_token": "JWT_TOKEN",
  "token_type": "bearer"
}
```

---

# Current User API

## GET `/api/v1/auth/me`

Returns the currently authenticated user based on the JWT.

Example response:

```json
{
  "id": 2,
  "name": "Alice",
  "email": "alice@email.com"
}
```

The endpoint does not require a user ID in the URL.

The backend identifies the user from the JWT.

---

# Login Page

The login page is located at:

```text
frontend/app/login/page.tsx
```

The login flow is:

```text
User enters email
       ↓
User enters password
       ↓
POST /api/v1/auth/login
       ↓
Backend validates credentials
       ↓
Backend returns JWT
       ↓
JWT stored in localStorage
       ↓
auth-changed event dispatched
       ↓
Redirect to homepage
```

---

# Register Page

The registration page is located at:

```text
frontend/app/register/page.tsx
```

The registration page allows users to create an account before using authenticated features.

---

# Auth Service

The frontend authentication service is located at:

```text
frontend/services/authService.ts
```

The service contains functionality for retrieving the current authenticated user.

The token is sent to the backend using:

```http
Authorization: Bearer <token>
```

---

# Authentication State

KelanaAI uses React state to determine whether a user is logged in.

The authentication state is based on the presence of:

```text
access_token
```

in localStorage.

When the authentication state changes, the frontend dispatches a custom event:

```text
auth-changed
```

This allows different components to synchronize their authentication state within the same browser tab.

The application also listens to:

```text
storage
```

events to synchronize authentication changes between browser tabs.

---

# AuthNav

The personalized navigation component is:

```text
frontend/components/AuthNav.tsx
```

The navbar dynamically changes depending on authentication status.

## When the user is not logged in

The navbar displays:

```text
Login
Register
```

## When the user is logged in

The navbar displays:

```text
Logout
Profile
```

The navigation also keeps:

```text
Plan Trip
Trip History
```

in the central area of the navbar.

---

# Personalized Welcome

After login, the navbar can display a personalized welcome message such as:

```text
Welcome back, Alice 👋
```

The welcome message is presented as a temporary UI notification rather than permanently occupying the navigation bar.

This provides a small personalized interaction without making the navbar crowded.

---

# Logout

When the user clicks Logout:

```text
localStorage
      ↓
Remove access_token
      ↓
Update authentication state
      ↓
Dispatch auth-changed event
      ↓
Redirect to /login
```

The logout functionality clears the JWT from localStorage.

---

# Profile Page

The profile page is available at:

```text
/profile
```

The page is implemented in:

```text
frontend/app/profile/page.tsx
```

The profile page retrieves the current user using:

```text
GET /api/v1/auth/me
```

The profile page displays:

- Name
- Email
- Total Trips Generated

Example:

```text
My Profile

Name
Alice

Email
alice@email.com

Total Trips Generated
4
```

---

# Profile Data Flow

The profile page uses:

```text
localStorage
     ↓
access_token
     ↓
GET /api/v1/auth/me
     ↓
FastAPI
     ↓
JWT validation
     ↓
Current User
     ↓
Next.js Profile Page
```

The profile page also retrieves the user's trips and calculates the total number of trips.

---

# Protected Profile Access

The profile page checks whether an authentication token exists.

If no token is found:

```text
/profile
    ↓
No access_token
    ↓
Redirect to /login
```

If the token is invalid or the API rejects it:

```text
API authentication failure
        ↓
Remove access_token
        ↓
Redirect to /login
```

---

# Personalized Navigation Layout

The current navbar follows this structure:

```text
┌─────────────────────────────────────────────────────────────┐
│ KelanaAI          Plan Trip   Trip History   Logout Profile │
└─────────────────────────────────────────────────────────────┘
```

The design intentionally separates the navigation into three areas:

```text
LEFT
KelanaAI

CENTER
Plan Trip
Trip History

RIGHT
Logout
Profile
```

When the user is not authenticated:

```text
┌─────────────────────────────────────────────────────────────┐
│ KelanaAI          Plan Trip   Trip History   Login Register │
└─────────────────────────────────────────────────────────────┘
```

This keeps the main navigation visually balanced.

---

# Authentication User Flow

The complete authentication flow is:

```text
                     ┌─────────────┐
                     │    User     │
                     └──────┬──────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
        ┌───────────┐               ┌───────────┐
        │ Register  │               │   Login   │
        └─────┬─────┘               └─────┬─────┘
              │                           │
              └─────────────┬─────────────┘
                            ▼
                    ┌──────────────┐
                    │   FastAPI    │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  PostgreSQL  │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │     JWT      │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ localStorage │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Authenticated│
                    │     User     │
                    └──────┬───────┘
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
          Profile      Trip History    Plan Trip
```

---

# User-Specific Experience

After authentication, the user can access:

```text
Home
  ↓
Plan Trip
  ↓
Generate AI Itinerary
  ↓
Trip History
  ↓
Trip Detail
  ↓
Profile
```

The profile page provides a centralized view of the user's account.

---

# Frontend Components

Important reusable components include:

```text
frontend/components/
```

## AuthNav.tsx

Responsible for:

- Detecting login status
- Showing Login/Register when logged out
- Showing Logout/Profile when logged in
- Synchronizing authentication changes
- Handling logout

## LogoutButton.tsx

Reusable logout UI component.

## TripCard.tsx

Displays saved trip information.

## TripHistoryClient.tsx

Handles:

- Search
- Sorting
- Pagination
- Trip history interaction

---

# Services

Frontend API services are organized in:

```text
frontend/services/
```

## authService.ts

Handles authentication-related API communication.

Main responsibility:

```text
Get Current User
```

## tripService.ts

Handles trip-related API communication.

---

# Complete Frontend Routes

KelanaAI currently provides:

```text
/                → Home / Plan Trip

/login           → Login

/register        → Register

/profile         → User Profile

/trips           → Trip History

/trips/{id}      → Trip Detail
```

---

# Current API Overview

The major API endpoints are:

```text
GET    /
GET    /health

POST   /api/v1/auth/register
POST   /api/v1/auth/login
GET    /api/v1/auth/me

POST   /api/v1/trips
GET    /api/v1/trips
GET    /api/v1/trips/{id}
PUT    /api/v1/trips/{id}
DELETE /api/v1/trips/{id}

POST   /api/v1/trips/{id}/generate

GET    /api/v1/trip-categories
GET    /api/v1/recommendations
GET    /api/v1/transportations
```

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

## Terminal 1 — Backend

```powershell
cd backend
.venv\Scripts\activate
uvicorn main:app --reload
```

## Terminal 2 — Frontend

```powershell
cd frontend
npm run dev
```

Then open:

```text
http://localhost:3000
```

Trip History:

```text
http://localhost:3000/trips
```

Profile:

```text
http://localhost:3000/profile
```

Login:

```text
http://localhost:3000/login
```

Register:

```text
http://localhost:3000/register
```

Swagger:

```text
http://localhost:8000/docs
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

```bash
git add .
git commit -m "Create Next.js frontend"
git push
git tag session-6
git push origin session-6
```

## Session 7

```bash
git add .
git commit -m "Create trip dashboard and enhance trip card components"
git push
git tag session-7
git push origin session-7
```

## Session 8

```bash
git add .
git commit -m "Add authentication profile and personalized navigation"
git push
git tag session-8
git push origin session-8
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
session-7
session-8
```

---

# Current Status

## Backend

- Session 1 — Completed
- Session 2 — Completed
- Session 3 — Completed
- Session 4 — Completed
- Session 5 — Completed
- Session 8 Authentication Backend — Completed

## Frontend

- Session 6 — Completed
- Session 7 — Completed
- Session 8 Authentication & Profile — Completed

---

# Current Features

KelanaAI currently provides:

## Travel Planning

- Travel information management
- Budget calculation
- Daily budget calculation
- Trip category classification
- Travel season detection
- Transportation recommendations
- Destination recommendations
- AI-powered itinerary generation

## Backend

- REST API
- FastAPI
- PostgreSQL persistence
- SQLAlchemy ORM
- Trip CRUD operations
- API health check
- Interactive Swagger documentation
- Amazon Bedrock integration
- Amazon Nova Lite integration
- AI recommendation persistence

## AI

- Amazon Bedrock
- Amazon Nova Lite
- AI-powered travel itinerary generation
- Rich AI prompt engineering
- Structured daily travel plans
- Markdown-formatted AI responses
- AI recommendation persistence in PostgreSQL

## Frontend

- Next.js
- React
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

## Trip History

- Trip History Dashboard
- Trip Detail pages
- Saved trip browsing
- Search trips
- Trip sorting
- Pagination
- Destination icons and flags
- Currency and budget formatting
- Category badges
- Travel style badges
- Structured itinerary parsing
- Day-by-day itinerary display
- Morning, Afternoon, and Evening itinerary sections
- General travel tips
- Trip summary information

## Authentication

- User registration
- User login
- JWT authentication
- bcrypt password hashing
- Current user endpoint
- Protected profile page
- User profile information
- Personalized navbar
- Login/Register navigation
- Logout functionality
- Authentication state synchronization
- Personalized welcome message

---

# Session 8 Achievement

Before Session 8, KelanaAI primarily provided travel planning and trip history.

```text
User
  ↓
Next.js
  ↓
FastAPI
  ↓
Amazon Bedrock
  ↓
PostgreSQL
  ↓
Trip History
```

After Session 8, the application provides a personalized authenticated experience:

```text
                    ┌───────────────┐
                    │     User      │
                    └───────┬───────┘
                            │
                    ┌───────▼───────┐
                    │ Authentication│
                    │ Login/Register │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │     JWT       │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │   Next.js     │
                    │   Frontend    │
                    └───────┬───────┘
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
       Profile          Plan Trip        Trip History
          │                 │                 │
          │                 ▼                 │
          │          Amazon Bedrock           │
          │                 │                 │
          │                 ▼                 │
          │            PostgreSQL ◄───────────┘
          │
          ▼
     User Information
```

KelanaAI is no longer only an AI travel planner.

It now provides a personalized, authenticated, multi-page travel planning experience.

Users can:

1. Create an account.
2. Login securely.
3. Receive a JWT access token.
4. Plan AI-powered trips.
5. Save generated trips.
6. Browse their trip history.
7. Open detailed itineraries.
8. View their personal profile.
9. See their total generated trips.
10. Logout securely.
11. Receive a personalized welcome message.

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
        ↓
Trip History Dashboard
        ↓
Search & Sorting
        ↓
Pagination
        ↓
Structured AI Itinerary
        ↓
Multi-page Travel Application
        ↓
User Authentication
        ↓
JWT
        ↓
Password Hashing
        ↓
User Profile
        ↓
Personalized Navigation
```

The project demonstrates how a simple Python application can progressively evolve into a full-stack AI-powered product with:

- Persistent data
- AI-generated travel recommendations
- Modern frontend
- REST API
- PostgreSQL
- User authentication
- JWT authorization
- Personalized user experience
- Multi-page travel application

---

# Future Development

Future sessions can extend KelanaAI toward a more complete AI-powered travel planning platform.

Potential improvements include:

- User-specific trip ownership and authorization
- Edit saved trips from the frontend
- Delete saved trips from the frontend
- AI itinerary refinement
- Regenerate specific days
- Regenerate complete itineraries
- More detailed destination information
- External travel APIs
- Real-time weather information
- Hotel integrations
- Flight integrations
- Maps integration
- Interactive destination maps
- Improved database relationships
- User settings
- Password change
- Forgot password functionality
- Refresh token mechanism
- Production-ready authentication
- Production deployment
- Cloud infrastructure
- Frontend deployment
- Backend deployment
- CI/CD pipeline
- Monitoring and logging
- Automated testing
- Unit testing
- Integration testing
- End-to-end testing

---

# Security Considerations

KelanaAI currently uses JWT-based authentication and bcrypt password hashing.

Important security practices include:

- Passwords are hashed before being stored.
- Plain-text passwords should never be stored.
- JWT tokens should not be committed to Git.
- AWS credentials must remain in environment variables.
- Database credentials must remain in environment variables.
- `.env` should not be committed.
- `.env.local` should not be committed.
- Production authentication should use secure token storage and HTTPS.
- Production deployments should use properly managed secrets.

---

# Environment Files

Backend:

```text
backend/.env
```

Example:

```env
DATABASE_URL=your_database_url
AWS_BEARER_TOKEN_BEDROCK=your_bedrock_token
AWS_REGION=ap-southeast-2
MODEL_ID=amazon.nova-lite-v1:0
```

Frontend:

```text
frontend/.env.local
```

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Environment files should remain local and should not be committed to Git.

---

# Project Summary

KelanaAI started as a simple Python console application for calculating travel information.

It progressively evolved through:

```text
Python
   ↓
Business Logic
   ↓
FastAPI
   ↓
PostgreSQL
   ↓
SQLAlchemy
   ↓
Amazon Bedrock
   ↓
AI Travel Planner
   ↓
Next.js
   ↓
React + TypeScript
   ↓
Modern UI
   ↓
Trip History
   ↓
Structured AI Itinerary
   ↓
Authentication
   ↓
JWT
   ↓
User Profile
   ↓
Personalized Travel Platform
```

KelanaAI demonstrates the development of a complete full-stack AI application from the ground up.

The project combines software engineering fundamentals, REST API development, database persistence, generative AI, frontend development, authentication, and user experience design into a single travel planning platform.

---

# Conclusion

KelanaAI has evolved from a simple Python learning project into a full-stack AI-powered travel planning application.

The current application provides:

```text
                 ┌─────────────────────┐
                 │      KelanaAI       │
                 │ AI Travel Planner    │
                 └──────────┬──────────┘
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
    Authentication      AI Planning       Trip History
          │                 │                 │
          ▼                 ▼                 ▼
         JWT          Amazon Bedrock     PostgreSQL
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
                            ▼
                     User Profile
```

The project demonstrates how a simple Python application can progressively evolve into a modern full-stack AI product with persistent data, generative AI, authentication, personalized user experiences, and a polished multi-page web interface.