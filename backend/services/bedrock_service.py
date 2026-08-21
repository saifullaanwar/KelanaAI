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
        aws_access_key_id="dummy",        # required by boto3 but overridden by token
        aws_secret_access_key="dummy",    # required by boto3 but overridden by token
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
        f"Please provide:\n"
        f"1. A daily itinerary for the entire trip.\n"
        f"2. An estimated daily budget.\n"
        f"3. Local food recommendations.\n"
        f"4. Transportation suggestions.\n"
        f"5. Recommended attractions and activities.\n\n"
        f"Make the recommendations practical, realistic, and suitable "
        f"for the specified budget and travel style.\n"
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
