const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000/api/v1";


// =========================================================
// SOURCE TYPE
// =========================================================

export type AssistantSource = {
  name: string;
  url: string | null;
};


// =========================================================
// ASSISTANT RESPONSE
// =========================================================

export type AssistantResponse = {
  question: string;
  answer: string;
  sources: AssistantSource[];
};


// =========================================================
// AUTH HEADERS
// =========================================================

function getAuthHeaders() {
  const token = localStorage.getItem(
    "access_token"
  );

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}


// =========================================================
// ASK ASSISTANT
// =========================================================

export async function askAssistant(
  question: string
): Promise<AssistantResponse> {

  const response = await fetch(
    `${API_URL}/assistant`,
    {
      method: "POST",

      headers: getAuthHeaders(),

      body: JSON.stringify({
        question,
      }),
    }
  );


  // =======================================================
  // ERROR HANDLING
  // =======================================================

  if (!response.ok) {

    let message =
      "Failed to ask assistant";

    try {

      const data =
        await response.json();

      message =
        data.detail ||
        message;

    } catch {
      // Ignore JSON parsing error
    }


    throw new Error(
      `${response.status}: ${message}`
    );
  }


  // =======================================================
  // RETURN RESPONSE
  // =======================================================

  const data: AssistantResponse = await response.json();

  // -------------------------------------------------------
  // DEBUG: Log raw response dari backend
  // -------------------------------------------------------

  console.log("[assistantService] Raw response dari backend:", data);
  console.log("[assistantService] sources count:", data.sources?.length ?? 0);

  data.sources?.forEach((src, i) => {
    console.log(
      `[assistantService] Source[${i}]`,
      "name:", src.name,
      "url:", src.url ?? "null"
    );
  });

  return data;
}