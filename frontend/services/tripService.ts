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
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    let message = "Failed to fetch trips";

    try {
      const data = await response.json();
      message = data.detail || message;
    } catch {
      // Ignore JSON parsing error
    }

    throw new Error(`${response.status}: ${message}`);
  }

  return response.json();
}

export async function getTrip(id: number) {
  const response = await fetch(`${API_URL}/trips/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    let message = "Failed to fetch trip";

    try {
      const data = await response.json();
      message = data.detail || message;
    } catch {
      // Ignore JSON parsing error
    }

    throw new Error(`${response.status}: ${message}`);
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
    let message = "Failed to generate trip";

    try {
      const result = await response.json();
      message = result.detail || message;
    } catch {
      // Ignore JSON parsing error
    }

    throw new Error(`${response.status}: ${message}`);
  }

  return response.json();
}