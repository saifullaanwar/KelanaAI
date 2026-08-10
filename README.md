# KelanaAI

KelanaAI is an AI-powered travel planning project built during the AI Native Software Engineer Bootcamp.

The project starts with a simple Python console application called **Trip Summary Generator**. The application collects travel information from the user and displays it in a structured format.

---

## Project Structure

```text
kelana-ai/
├── README.md
├── backend/
│   └── main.py
└── frontend/
    └── .gitkeep
```

### Folder Description

- `backend/` — contains the Python application.
- `backend/main.py` — main entry point of the console application.
- `frontend/` — reserved for the frontend application in future sessions.
- `README.md` — project documentation.

---

# Session 1 — Building the First Feature

## Feature: Trip Summary Generator

The first feature of KelanaAI is a console-based travel summary generator.

The application demonstrates basic Python programming concepts:

- Variables
- Data types
- User input
- Type conversion
- Functions
- Function parameters
- f-strings
- Conditional logic
- Git and GitHub workflow

---

# 1. Variables

The first exercise introduces variables for storing travel information.

```python
destination = input("Destination : ")
days = int(input("Days : "))
budget = float(input("Budget : "))
travel_style = input("Travel Style : ")
```

### Explanation

Each variable stores a different piece of travel information.

| Variable | Data Type | Example |
|---|---|---|
| `destination` | String | `"Japan"` |
| `days` | Integer | `5` |
| `budget` | Float | `1500.0` |
| `travel_style` | String | `"Family"` |

### `input()`

The `input()` function is used to receive information from the user.

```python
destination = input("Destination : ")
```

If the user enters:

```text
Japan
```

Python stores:

```python
destination = "Japan"
```

---

## Type Conversion

By default, `input()` returns a string.

Therefore, numbers need to be converted into the appropriate data type.

### Integer

```python
days = int(input("Days : "))
```

If the user enters:

```text
5
```

Python converts it into:

```python
5
```

which is an integer.

### Float

```python
budget = float(input("Budget : "))
```

If the user enters:

```text
1500
```

Python stores it as:

```python
1500.0
```

which is a float.

---

# 2. Reusing Variables

Variables can be reused anywhere in the program.

```python
print(f"destination     : {destination}")
print(f"days            : {days}")
print(f"budget          : {budget}")
print(f"travel_style    : {travel_style}")
```

The `f` before the string creates an **f-string**.

It allows variables to be inserted directly into text.

For example:

```python
destination = "Japan"

print(f"Destination: {destination}")
```

Output:

```text
Destination: Japan
```

---

# 3. Creating a Function

The next step is to group the trip summary logic into a function.

```python
def print_trip_summary(destination, days, budget, travel_style):
    print("=========================")
    print("KelanaAI")
    print("=========================")
    print(f"Destination     : {destination}")
    print(f"Days            : {days}")
    print(f"Budget          : {budget}")
    print(f"Travel Style    : {travel_style}")
```

A function allows us to organize code and reuse the same logic multiple times.

The function receives four parameters:

- `destination`
- `days`
- `budget`
- `travel_style`

---

## Calling the Function

The function can then be called with different trip information.

```python
print_trip_summary("Japan", 5, 1500, "Family")
print_trip_summary("Bali", 3, 800, "Backpacker")
```

This allows the same function to generate summaries for different trips.

---

# 4. Challenge — Cost Breakdown

The next exercise extends the Trip Summary Generator with estimated travel costs.

Additional variables were introduced:

```python
hotel_cost
food_cost
transportation_cost
miscellaneous_cost
```

The total cost can be calculated using:

```python
total_estimated_cost = (
    hotel_cost
    + food_cost
    + transportation_cost
    + miscellaneous_cost
)
```

The application can also check whether the estimated cost exceeds the user's budget.

```python
if total_estimated_cost > budget:
    print("⚠️ Budget exceeded.")
```

This exercise introduces basic Python logic and arithmetic operations.

> Note: The cost breakdown is a challenge exercise and is not part of the final Session 1 homework requirement.

---

# 5. Homework — Enrich the Trip Summary

The final Session 1 homework extends the application with three additional variables:

- `country`
- `currency`
- `travel_month`

The final function is:

```python
def print_trip_summary(
    destination,
    country,
    days,
    budget,
    currency,
    travel_month
):
    print("========================")
    print("KelanaAI")
    print("========================")
    print(f"Destination   : {destination}")
    print(f"Country       : {country}")
    print(f"Days          : {days}")
    print(f"Budget        : {budget} {currency}")
    print(f"Currency      : {currency}")
    print(f"Travel Month  : {travel_month}")
```

---

## Interactive Input

The application asks the user for all required information.

```python
destination = input("Destination: ")
country = input("Country: ")
days = int(input("Days: "))
budget = float(input("Budget: "))
currency = input("Currency: ")
travel_month = input("Travel Month: ")
```

### Input types

| Input | Conversion | Example |
|---|---|---|
| `destination` | None | `Japan` |
| `country` | None | `Japan` |
| `days` | `int()` | `5` |
| `budget` | `float()` | `1500` |
| `currency` | None | `USD` |
| `travel_month` | None | `December` |

---

# 6. Calling the Final Function

After collecting all user input, the values are passed to the function.

```python
print_trip_summary(
    destination,
    country,
    days,
    budget,
    currency,
    travel_month
)
```

The function then formats and displays the travel information.

---

# 7. Example Program Execution

Run the application from the `backend` directory:

```bash
python main.py
```

The program will ask:

```text
Destination:
Country:
Days:
Budget:
Currency:
Travel Month:
```

Example input:

```text
Destination: Japan
Country: Japan
Days: 5
Budget: 1500
Currency: USD
Travel Month: December
```

Expected output:

```text
========================
KelanaAI
========================
Destination   : Japan
Country       : Japan
Days          : 5
Budget        : 1500.0 USD
Currency      : USD
Travel Month  : December
```

---

# 8. Python Concepts Learned

Through this exercise, the following concepts were practiced:

### Variables

Variables store information that can be reused in the program.

```python
destination = "Japan"
```

### Input

`input()` allows the application to receive information from the user.

```python
country = input("Country: ")
```

### Type Conversion

`int()` converts input into an integer.

```python
days = int(input("Days: "))
```

`float()` converts input into a floating-point number.

```python
budget = float(input("Budget: "))
```

### Functions

Functions group reusable logic.

```python
def print_trip_summary(...):
```

### Parameters

Parameters allow data to be passed into a function.

```python
print_trip_summary(
    destination,
    country,
    days,
    budget,
    currency,
    travel_month
)
```

### f-Strings

f-strings allow variables to be embedded inside strings.

```python
print(f"Destination   : {destination}")
```

---

# 9. Git Workflow

The project uses Git for version control.

Initialize the repository:

```bash
git init
```

Check the repository status:

```bash
git status
```

Add project files:

```bash
git add .
```

Create the first commit:

```bash
git commit -m "Create initial KelanaAI console app"
```

Connect the project to GitHub:

```bash
git remote add origin <YOUR_GITHUB_REPOSITORY_URL>
```

Push the code:

```bash
git push -u origin main
```

Create the Session 1 release tag:

```bash
git tag v0.1.0
```

Push the tag to GitHub:

```bash
git push origin v0.1.0
```

---

# 10. Session 1 Deliverables

By the end of Session 1, the project should contain:

- Working Python console application
- Interactive user input
- `int()` conversion for days
- `float()` conversion for budget
- `print_trip_summary()` function
- f-string formatted output
- Git repository
- Initial Git commit
- GitHub repository
- Release tag `v0.1.0`

---

## Session 1 Goal

The goal of Session 1 is to build the first working feature of KelanaAI while learning the fundamentals of Python development and Git version control.

Future sessions will extend KelanaAI with additional features and eventually transform it into a more complete AI-powered travel planner.