const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000/api/v1";

export type CurrentUser = {
  id: number;
  name: string;
  email: string;
};

export async function getCurrentUser(): Promise<CurrentUser> {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch current user");
  }

  return response.json();
}