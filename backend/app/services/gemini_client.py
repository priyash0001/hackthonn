import os
import base64
from typing import Optional, List
from io import BytesIO

try:
    from google import genai
    from google.genai import types
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False

from ..config import settings

class GeminiClient:
    """
    Wrapper for Google GenAI SDK.
    Order of preference:
    1st: Primary fast Gemini model (e.g. gemini-3.5-flash, gemini-flash-lite-latest)
    2nd: Secondary Gemini fallback models (gemini-3.1-flash-lite-preview)
    3rd: Gemma models (gemma-4-26b-a4b-it)
    """

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.client = None
        if GENAI_AVAILABLE and self.api_key:
            try:
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                print(f"Warning: Failed to initialize genai.Client: {e}")

    def generate_content(
        self,
        prompt: str,
        image_bytes: Optional[bytes] = None,
        mime_type: str = "image/png",
        model: Optional[str] = None,
        system_instruction: Optional[str] = None,
        temperature: float = 0.3
    ) -> Optional[str]:
        if not self.client:
            return None

        # Exact priority order requested:
        # 1st: Primary fast model
        # 2nd: Gemini fallback
        # 3rd: Gemma
        models_to_try = [
            m for m in [
                model,
                settings.PRIMARY_MODEL,
                "gemini-3.5-flash",
                "gemini-flash-lite-latest",
                "gemini-3.1-flash-lite-preview",
                settings.FALLBACK_MODEL,
                "gemma-4-26b-a4b-it"
            ] if m and m != "gemma-4-31b-it"
        ]
        
        # Deduplicate while preserving strict priority order
        seen = set()
        models_to_try = [m for m in models_to_try if not (m in seen or seen.add(m))]

        contents = []
        if image_bytes:
            contents.append(
                types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
            )
        contents.append(prompt)

        config_args = {
            "temperature": temperature,
            "automatic_function_calling": types.AutomaticFunctionCallingConfig(disable=True)
        }
        if system_instruction:
            config_args["system_instruction"] = system_instruction

        config = types.GenerateContentConfig(**config_args)

        for model_name in models_to_try:
            try:
                response = self.client.models.generate_content(
                    model=model_name,
                    contents=contents,
                    config=config
                )
                if response and response.text:
                    return response.text
            except Exception as e:
                print(f"Attempt with model '{model_name}' failed: {e}. Trying next model...")
                continue

        return None
