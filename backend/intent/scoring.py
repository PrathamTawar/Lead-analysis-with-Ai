import re
from .models import Offer
import google.generativeai as genai
from google.api_core.exceptions import GoogleAPICallError, ResourceExhausted
import json
import os
from dotenv import load_dotenv  # correct import
load_dotenv()  # loads variables from .env into environment
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

genai.configure(api_key=GOOGLE_API_KEY)


def _safe_parse_json(text: str):
    try:
        return json.loads(text)
    except Exception:
        m = re.search(r"\{.*\}", text, re.S)
        if m:
            try:
                return json.loads(m.group(0))
            except Exception:
                pass
    return {"intent": "Low", "reasoning": "Could not parse model output; defaulting low."}


def ai_analysis_for(offer: Offer, lead: dict):
    print("offer and lead", offer, lead)
    prompt = f"""
        You are an intent classification system.

        Task: Classify how well this lead matches the offer.
        Lead: {lead}
        Offer: {offer.__dict__}

        Return output strictly as valid JSON:
        {{
          "intent": "high|low",
          "reasoning": "≤ 40 words explaining the choice",
          "score": integer from 0 to 10, where:
              - 0 = very poor match
              - 10 = perfect match
              - intermediate values (1 to 9) = partial similarity
        }}

        Rules:
        - "intent" must be exactly one of: high or low
        - "score" should be proportional to the similarity (not just 0 or 10).
        - No text outside the JSON
    """

    try:
        model = genai.GenerativeModel('models/gemini-2.5-flash-lite')
        response = model.generate_content(prompt)
    except ResourceExhausted as e:
        raise Exception(f"Gemini API quota exceeded: {e}") from e
    except GoogleAPICallError as e:
        raise Exception(f"Gemini API call failed: {e}") from e
    except Exception as e:
        raise Exception(f"Failed to generate content: {e}") from e

    intent = response.text.strip().lower()
    print("response and intent", response, intent)

    return _safe_parse_json(intent)
