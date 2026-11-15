"""Request and response models for the document-grounded chatbot API."""

from pydantic import BaseModel, ConfigDict, Field


class ChatRequest(BaseModel):
    """Represent one user question for the website assistant."""

    model_config = ConfigDict(str_strip_whitespace=True)

    message: str = Field(min_length=1, max_length=1000)


class ActionButton(BaseModel):
    """An actionable in-app navigation button suggested by the assistant."""

    label: str
    path: str
    description: str | None = None


class ChatResponse(BaseModel):
    """Return an answer, the knowledge sections used, and actionable navigation buttons."""

    answer: str
    sources: list[str]
    actions: list[ActionButton] = []
