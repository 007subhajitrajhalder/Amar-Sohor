"""Expose the document-grounded Amar Sohor chatbot API using Google Gemini."""

from fastapi import APIRouter, HTTPException, Depends

from app.chatbot.facility_counts import FacilityCountError
from app.chatbot.schemas import ChatRequest, ChatResponse
from app.chatbot.service import GeminiError, answer_question
from app.dependencies.auth import get_current_user_id


router = APIRouter(prefix="/chatbot", tags=["Chatbot"])


@router.post("/chat", response_model=ChatResponse)
def chat(
    request: ChatRequest,
    current_user_id: int = Depends(get_current_user_id),
) -> ChatResponse:
    """Answer user questions from project documentation using the Gemini API for authenticated users."""
    try:
        return answer_question(request.message)
    except FacilityCountError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except GeminiError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
