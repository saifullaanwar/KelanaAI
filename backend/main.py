# Variables store the trip data
#destination  = input("Destination : ")
#days         = int(input("Days : "))
#budget       = float(input("Budget : "))
#travel_style = input("Travel Style : ")

# Reuse them anywhere
#print(f"destination     : {destination}")        
#print(f"days            : {days}")                    
#print(f"budget          : {budget}")
#print(f"travel_style    : {travel_style}")


#------------


#def print_trip_summary(destination, days, budget, travel_style) :
   #print("=========================")
    #print("KelanaAI")
    #print("=========================")
    #print(f"destination     : {destination}")        
    #print(f"days            : {days}")                    
    #print(f"budget          : {budget}")
    #print(f"travel_style    : {travel_style}")

# Call if with any trip
#print_trip_summary("Japan", 5, 1500, "Family")
#print_trip_summary("Bali", 3, 800, "Backpacker")

#----
# def print_trip_summary(
#     destination,
#     days,
#     budget,
#     travel_style,
#     hotel_cost,
#     food_cost,
#     transportation_cost,
#     miscellaneous_cost
# ):
#     total_estimated_cost = (
#         hotel_cost
#         + food_cost
#         + transportation_cost
#         + miscellaneous_cost
#     )

#     print("====================")
#     print("KelanaAI")
#     print("====================")
#     print(f"Destination       : {destination}")
#     print(f"Days              : {days}")
#     print(f"Budget            : {budget}")
#     print(f"Travel Style      : {travel_style}")
#     print(f"Hotel Cost        : {hotel_cost}")
#     print(f"Food Cost         : {food_cost}")
#     print(f"Transport         : {transportation_cost}")
#     print(f"Misc Cost         : {miscellaneous_cost}")
    
#     print(f"Total Cost        : {total_estimated_cost}")

    
#     if total_estimated_cost > budget:
#         print("⚠️ Budget exceeded.")

#     print()

# # Call it with any trip
# print_trip_summary(
#     "Japan",
#     5,
#     1500,
#     "Family",
#     500,
#     300,
#     200,
#     100
# )

# print_trip_summary(
#     "Bali",
#     3,
#     800,
#     "Backpacker",
#     400,
#     250,
#     100,
#     100
# )

#----

# Home Work

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


destination = input("Destination: ")
country = input("Country: ")
days = int(input("Days: "))
budget = float(input("Budget: "))
currency = input("Currency: ")
travel_month = input("Travel Month: ")

print_trip_summary(
    destination,
    country,
    days,
    budget,
    currency,
    travel_month
)