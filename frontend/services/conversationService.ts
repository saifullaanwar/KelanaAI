const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000/api/v1";


// =========================================================
// TYPES
// =========================================================

export type CreateConversationResponse = {
  conversation_id: number;
};

export type Conversation = {
  id: number;
  title: string | null;
  created_at: string;
};

export type ConversationMessage = {
  id: number;
  conversation_id: number;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

export type RenameConversationResponse = {
  id: number;
  title: string;
};

export type SendMessageResponse = {
  conversation_id: number;
  message_id: number;
  role: string;
  content: string;
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
// CREATE CONVERSATION
// =========================================================

export async function createConversation(): Promise<CreateConversationResponse> {

  const response = await fetch(
    `${API_URL}/conversations`,
    {
      method: "POST",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {

    let message = "Failed to create conversation";

    try {
      const data = await response.json();
      message = data.detail || message;
    } catch {
      // Ignore JSON parsing error
    }

    throw new Error(
      `${response.status}: ${message}`
    );
  }

  return response.json();
}


// =========================================================
// GET CONVERSATIONS
// =========================================================

export async function getConversations(): Promise<Conversation[]> {

  const response = await fetch(
    `${API_URL}/conversations`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {

    let message = "Failed to load conversations";

    try {
      const data = await response.json();
      message = data.detail || message;
    } catch {
      // Ignore JSON parsing error
    }

    throw new Error(
      `${response.status}: ${message}`
    );
  }

  return response.json();
}


// =========================================================
// GET MESSAGES
// =========================================================

export async function getMessages(
  conversationId: number
): Promise<ConversationMessage[]> {

  const response = await fetch(
    `${API_URL}/conversations/${conversationId}/messages`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {

    let message = "Failed to load messages";

    try {
      const data = await response.json();
      message = data.detail || message;
    } catch {
      // Ignore JSON parsing error
    }

    throw new Error(
      `${response.status}: ${message}`
    );
  }

  return response.json();
}


// =========================================================
// RENAME CONVERSATION
// =========================================================

export async function renameConversation(
  conversationId: number,
  title: string
): Promise<RenameConversationResponse> {

  const response = await fetch(
    `${API_URL}/conversations/${conversationId}`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ title }),
    }
  );

  if (!response.ok) {

    let message = "Failed to rename conversation";

    try {
      const data = await response.json();
      message = data.detail || message;
    } catch {
      // Ignore JSON parsing error
    }

    throw new Error(
      `${response.status}: ${message}`
    );
  }

  return response.json();
}


// =========================================================
// SEND MESSAGE
// =========================================================

export async function sendMessage(
  conversationId: number,
  content: string
): Promise<SendMessageResponse> {

  const response = await fetch(
    `${API_URL}/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ content }),
    }
  );

  if (!response.ok) {

    let message = "Failed to send message";

    try {
      const data = await response.json();
      message = data.detail || message;
    } catch {
      // Ignore JSON parsing error
    }

    throw new Error(
      `${response.status}: ${message}`
    );
  }

  return response.json();
}
