import os
import json
import boto3
from botocore.auth import SigV4Auth
from botocore.credentials import Credentials
from dotenv import load_dotenv

load_dotenv()

# --- Configuration ---

AWS_BEARER_TOKEN = os.getenv("AWS_BEARER_TOKEN_BEDROCK")
AWS_REGION = os.getenv("AWS_REGION", "ap-southeast-2")
MODEL_ID = os.getenv("MODEL_ID", "amazon.nova-lite-v1:0")


def get_bedrock_client():
    """
    Create and return a boto3 Bedrock Runtime client authenticated
    using the bearer token stored in AWS_BEARER_TOKEN_BEDROCK.
    """
    if not AWS_BEARER_TOKEN:
        raise ValueError("AWS_BEARER_TOKEN_BEDROCK is not set in the environment.")

    client = boto3.client(
        service_name="bedrock-runtime",
        region_name=AWS_REGION,
        aws_access_key_id="dummy",  # required by boto3 but overridden by token
        aws_secret_access_key="dummy",  # required by boto3 but overridden by token
        aws_session_token=AWS_BEARER_TOKEN,
    )
    return client


def get_ai_recommendation(
    destination: str,
    days: int,
    budget: float,
    travel_style: str,
) -> str:
    """
    Call AWS Bedrock to generate a travel itinerary recommendation.

    Args:
        destination:   The travel destination (e.g. "Bali, Indonesia").
        days:          Number of days for the trip.
        budget:        Total budget in USD.
        travel_style:  Travel style (e.g. "adventure", "luxury", "backpacker").

    Returns:
        The AI-generated itinerary as a plain string.
    """
    prompt = (
        f"You are an experienced travel planner.\n\n"
        f"Create a personalized travel itinerary using the following trip details:\n"
        f"- Destination: {destination}\n"
        f"- Number of Days: {days}\n"
        f"- Budget: USD {budget}\n"
        f"- Travel Style: {travel_style}\n\n"
        f"For each day, create a structured daily plan with the following sections:\n\n"
        f"Morning:\n"
        f"- Provide 2-3 specific morning activities.\n"
        f"- Include practical activities such as sightseeing, breakfast, "
        f"walking tours, or local experiences.\n\n"
        f"Afternoon:\n"
        f"- Recommend cultural sites and local experiences.\n"
        f"- Include specific attractions, historical places, museums, "
        f"markets, or cultural activities when appropriate.\n\n"
        f"Evening:\n"
        f"- Recommend suitable dinner spots or local food experiences.\n"
        f"- Suggest appropriate nightlife or evening entertainment.\n\n"
        f"Also provide:\n"
        f"- An estimated daily budget.\n"
        f"- Transportation suggestions.\n"
        f"- Recommended attractions and activities.\n\n"
        f"Make the recommendations practical, realistic, and suitable "
        f"for the specified budget and travel style.\n\n"
        f"Format your response as Markdown with clear headings (##) "
        f"and bullet lists (-)."
    )

    # Payload format for Amazon Nova / Converse API
    payload = {
        "messages": [
            {
                "role": "user",
                "content": [{"text": prompt}],
            }
        ]
    }

    client = get_bedrock_client()

    response = client.converse(
        modelId=MODEL_ID,
        messages=payload["messages"],
    )

    # Extract the text content from the response
    output = response["output"]["message"]["content"][0]["text"]
    return output


def get_ai_chat_response(
    messages: list[dict],
    user_name: str = "",
) -> str:
    """
    Send conversation history to Amazon Bedrock
    and return the AI response as plain text.

    If user_name is provided, it is injected as a system prompt
    so the AI can address the user by their real name.
    The system prompt is NOT stored in the database — it is only
    sent at inference time and does not affect conversation memory.
    """

    client = get_bedrock_client()

    # ----------------------------------------------------------
    # Build system prompt with user identity context.
    # This tells the AI who it is talking to without adding
    # a fake message to the conversation history.
    # ----------------------------------------------------------

    system_prompt = (
        "You are KelanaAI, a friendly and knowledgeable AI travel assistant. "
        "You help users plan trips, create itineraries, and answer travel questions."
    )

    if user_name:
        system_prompt += (
            f" The user's name is {user_name}. "
            "Address the user by their name naturally when appropriate, "
            "especially when greeting them."
        )

    response = client.converse(
        modelId=MODEL_ID,
        messages=messages,
        system=[{"text": system_prompt}],
    )

    output = response["output"]["message"]["content"][0]["text"]

    return output
