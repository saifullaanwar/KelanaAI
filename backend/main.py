from services.trip_service import (
    calculate_daily_budget,
    get_trip_category,
    get_transportation_recommendation,
    get_travel_season,
    get_recommended_places
)


def print_trip_summary(
    destination,
    country,
    days,
    budget,
    currency,
    travel_month,
    category,
    transportation,
    daily_budget,
    season
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
    print(f"Season        : {season}")

    print("========================")
    print(f"Category                    : {category}")
    print(f"Recommended Transportation  : {transportation}")
    print(f"Daily Budget                : {daily_budget} {currency}/day")


# ========================================
# INPUT MULTIPLE DESTINATIONS
# ========================================

destinations = []

while True:
    destination = input(
        "Destination (type 'done' to finish): "
    )

    if destination.lower() == "done":
        break

    destinations.append(destination)


# ========================================
# CHECK DESTINATIONS
# ========================================

if not destinations:
    print("No destination entered.")
    exit()


# ========================================
# DISPLAY DESTINATIONS
# ========================================

print("========================")
print("Your Destinations")
print("========================")

for index, destination in enumerate(destinations, start=1):
    print(f"{index}. {destination}")


# ========================================
# INPUT TRIP INFORMATION
# ========================================

country = input("Country: ")
days = int(input("Days: "))
budget = float(input("Budget: "))
currency = input("Currency: ")
travel_month = input("Travel Month: ")


# ========================================
# CALCULATE TRIP INFORMATION
# ========================================

category = get_trip_category(budget)

daily_budget = calculate_daily_budget(
    budget,
    days
)

transportation = get_transportation_recommendation(
    category
)

season = get_travel_season(
    travel_month
)


# ========================================
# COMBINE DESTINATIONS
# ========================================

destination = ", ".join(destinations)


# ========================================
# PRINT TRIP SUMMARY
# ========================================

print_trip_summary(
    destination,
    country,
    days,
    budget,
    currency,
    travel_month,
    category,
    transportation,
    daily_budget,
    season
)


# ========================================
# DISPLAY RECOMMENDED PLACES
# ========================================

print("========================")
print("Recommended Places")
print("========================")

for destination_name in destinations:

    recommended_places = get_recommended_places(
        destination_name
    )

    print(f"\n--- {destination_name} ---")

    for place in recommended_places:
        print(f"- {place}")