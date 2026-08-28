const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

function getAuthHeaders() {
  const token = localStorage.getItem("access_token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getTrips() {
  const response = await fetch(`${API_URL}/trips`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch trips");
  }

  return response.json();
}

export async function getTrip(id: number) {
  const response = await fetch(`${API_URL}/trips/${id}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch trip");
  }

  return response.json();
}

export async function generateTrip(data: {
  destination: string;
  days: number;
  budget: number;
  travel_style: string;
}) {
  const response = await fetch(`${API_URL}/trips`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to generate trip");
  }

  return response.json();
}