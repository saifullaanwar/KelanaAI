# KelanaAI

KelanaAI is a console-based travel planning application built with Python during the AI Native Software Engineer Bootcamp.

The project is developed progressively, starting from a simple Trip Summary Generator and evolving into a basic travel recommendation engine.

---

## Project Structure

```text
kelana-ai/
├── README.md
├── .gitignore
├── backend/
│   ├── main.py
│   └── services/
│       └── trip_service.py
└── frontend/
    └── .gitkeep
```

### Description

- `backend/main.py` — handles user input and displays the application output.
- `backend/services/trip_service.py` — contains the application's business logic.
- `frontend/` — reserved for future frontend development.
- `.gitignore` — prevents Python cache files from being tracked by Git.

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

## Example Output

```text
========================
KelanaAI
========================
Destination   : Japan, Korea
Country       : Indonesia
Days          : 5
Budget        : 1500.0 IDR
Currency      : IDR
Travel Month  : February
Season        : Regular Season
========================
Category                    : Standard
Recommended Transportation  : Train
Daily Budget                : 300.0 IDR/day
========================
Recommended Places
========================

--- Japan ---
- Tokyo Tower
- Shibuya
- Mount Fuji

--- Korea ---
- N Seoul Tower
- Gyeongbokgung Palace
- Myeongdong
```

---

## How to Run

Open the terminal in the `backend` directory:

```bash
python main.py
```

---

## Git Version Control

### Session 1

```bash
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

---

## Current Status

- Session 1 — Completed
- Session 2 — Completed

KelanaAI currently provides basic travel information, budget analysis, travel season detection, transportation recommendations, and destination recommendations.

Future sessions will extend the application toward a more complete AI-powered travel planning system.