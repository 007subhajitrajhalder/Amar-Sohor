"""Retrieve project-document context and generate answers through Google Gemini API."""

from dataclasses import dataclass
from functools import lru_cache
import os
from pathlib import Path
from dotenv import load_dotenv

from google import genai
from google.genai import types
from google.genai.errors import APIError

from app.chatbot.facility_counts import get_facility_count_answer
from app.chatbot.schemas import ChatResponse, ActionButton

# Load backend/.env reliably regardless of current working directory
_BACKEND_DIR = Path(__file__).resolve().parents[2]
_ENV_FILE = _BACKEND_DIR / ".env"
if _ENV_FILE.exists():
    load_dotenv(dotenv_path=_ENV_FILE)
else:
    load_dotenv()

KNOWLEDGE_DIR = Path(__file__).resolve().parent / "knowledge"
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite").strip()

SYSTEM_PROMPT = """You are the official Amar Sohor AI Civic Assistant.
Amar Sohor is a GIS-integrated smart city civic platform for Kolkata that connects citizens,
municipal agencies, and city administrators to maintain public infrastructure (dustbins, public toilets,
drinking water taps, and public parking zones).

Your mission is to help citizens, agency personnel, and administrators understand and navigate the website.

Strict Behavioral Instructions:
1. Base your answers on the provided project reference documentation.
2. Clearly explain platform features:
   - Reporting issues on existing facilities with MobileNetV3 AI photo verification
   - Anti-duplicate fraud defense (>= 98.5% rejection) and background scene matching (>= 35%)
   - Fair agency rejection standards (50% AI threshold requiring on-site proof photos for defects)
   - 24-hour rejection spam cooldown and single active report rule
   - Interactive GIS map discovery with operational status indicators (OPEN, UNDER_REPAIR, SUSPENDED)
   - Rating and reviewing facilities (1 to 5 stars with citizen reviews)
   - Proposing new facilities through the Recommendation lifecycle (PENDING -> ALLOCATED -> UNDER_INVESTIGATION -> APPROVED/REJECTED/INSTALLED)
   - User account and profile management: When signed in, click your name in the top navigation header on any page to open your Citizen Dashboard, where you can view and edit your profile details (Full Name, Phone Number, Email) and monitor all submitted complaints and recommendations.
   - User roles and permissions (Citizen USER, Agency AGENT, Admin ADMIN)
3. Maintain clear privacy boundaries: you are a project reference assistant and do NOT have live access
   to the database, user accounts, current ticket records, or real-time facility availability.
   Direct users to the relevant citizen, agency, or admin portals for live actions.
4. Keep answers clear, professional, concise, and structured with clean markdown.
5. If the documentation does not contain the answer, politely state that the project guide does not specify it.
6. Language support: You support both English and Bengali (বাংলা). If the user asks in Bengali or Benglish, respond warmly, accurately, and naturally in Bengali (বাংলা). Otherwise, respond in English.
7. Actionable Navigation Instructions (IMPORTANT):
   - Do NOT output raw URL paths like "/citizen/report-issue", "/map", or "/facilities/{facilityId}".
   - For reporting issues: Explain that reporting an issue requires selecting a facility on the interactive map!
     Tell the citizen: "Open the interactive map, find and click on the specific facility marker (dustbin, toilet, drinking water tap, or parking zone), and click 'Report Issue' to submit your report with a verified photo."
   - For user profile and dashboard:
     Tell the user: "When signed in, click your name button in the top navigation header on any page to open your **Citizen Dashboard**, where you can view and edit your personal profile details (Full Name, Phone Number, and Email Address) and click 'Save Changes'."
   - Examples of other page guidance:
     * "From your Citizen Dashboard, click the 'View My Reports' button in the top action bar to monitor your submitted grievances."
     * "From the Home page, scroll to the 'Citizen Recommendation' banner and click 'Recommend a Facility' (or click 'Recommend Facility' on your Citizen Dashboard)."
     * "To register or log in, click the 'Register' or 'Login' button in the top-right corner of the Home page header."
     * "For agencies: Sign in to your Agency Dashboard and click 'Assigned Reports' to review and start investigations."
"""


class GeminiError(RuntimeError):
    """Indicate a Gemini configuration, connection, or response error."""


@dataclass(frozen=True)
class KnowledgeDocument:
    """Store one loaded static project knowledge document."""
    name: str
    title: str
    content: str


def load_knowledge_documents() -> list[KnowledgeDocument]:
    """Load all Markdown knowledge files from the knowledge directory."""
    documents: list[KnowledgeDocument] = []
    if not KNOWLEDGE_DIR.exists():
        return documents

    for file_path in sorted(KNOWLEDGE_DIR.glob("*.md")):
        content = file_path.read_text(encoding="utf-8").strip()
        title = file_path.stem.replace("_", " ").title()
        documents.append(
            KnowledgeDocument(
                name=file_path.name,
                title=title,
                content=content,
            )
        )
    return documents


@lru_cache(maxsize=1)
def get_compiled_knowledge_base() -> tuple[str, tuple[str, ...]]:
    """Compile all project guides into a single structured reference context."""
    docs = load_knowledge_documents()
    sections = []
    sources = []
    for doc in docs:
        sources.append(doc.name)
        sections.append(f"=== PROJECT GUIDE: {doc.name} ({doc.title}) ===\n{doc.content}")
    compiled_text = "\n\n" + ("\n\n" + "=" * 50 + "\n\n").join(sections) + "\n\n"
    return compiled_text, tuple(sources)


def _get_gemini_client() -> genai.Client:
    """Initialize and validate the Google GenAI client."""
    api_key = os.getenv("GEMINI_API_KEY", "").strip() or GEMINI_API_KEY
    if not api_key:
        raise GeminiError(
            "GEMINI_API_KEY is not configured in backend/.env. "
            "Please obtain a free API key from Google AI Studio (https://aistudio.google.com/app/apikey) "
            "and add GEMINI_API_KEY=your_key to backend/.env."
        )
    return genai.Client(api_key=api_key)


def resolve_action_buttons(question: str, answer: str, sources: list[str]) -> list[ActionButton]:
    """Determine the most relevant actionable in-app navigation buttons for the suggested page."""
    q_lower = question.lower()
    text = (question + " " + answer).lower()
    actions: list[ActionButton] = []
    seen = set()

    def add_action(label: str, path: str, description: str | None = None):
        key = (label, path)
        if key not in seen:
            seen.add(key)
            actions.append(ActionButton(label=label, path=path, description=description))

    # Priority 1: User Profile / Account / Citizen Dashboard query
    is_profile_query = any(k in q_lower for k in [
        "profile", "user profile", "my profile", "account", "my account",
        "settings", "edit profile", "change name", "phone number", "dashboard",
        "citizen dashboard", "user portal", "প্রোফাইল"
    ]) or any(k in text for k in ["user profile", "edit your profile", "profile details"])

    if is_profile_query:
        add_action("Citizen Dashboard / Profile", "/citizen/dashboard", "View and update your personal details, profile, and civic activities")

    # Priority 2: Issue Reporting / Grievance (routes to /map so user selects facility first)
    is_report_query = any(k in q_lower for k in [
        "report an issue", "report issue", "broken tap", "damaged dustbin",
        "overflowing", "lodge complaint", "file report", "file a complaint",
        "broken", "complaint", "grievance", "leakage", "defective", "অভিযোগ"
    ])
    if is_report_query:
        add_action("Select Facility on Map to Report", "/map", "Locate facility on the interactive map and click Report Issue")
        add_action("Explore Map & Facilities", "/map", "Discover civic facilities and live operational statuses")

    # Priority 3: Viewing Submitted Reports
    is_my_reports_query = any(k in q_lower for k in [
        "my reports", "track report", "view my reports", "report status", "check status", "investigation status"
    ]) or ("my reports" in text and "view my reports" in text)
    if is_my_reports_query:
        add_action("View My Reports", "/citizen/my-reports", "Monitor your submitted grievances and resolution photos")
        if not is_profile_query:
            add_action("Citizen Dashboard / Profile", "/citizen/dashboard", "Access your citizen overview and reports")

    # Priority 4: Recommending / Proposing New Facilities
    is_recommend_query = any(k in q_lower for k in [
        "recommend", "recommendation", "propose", "missing facility", "new facility", "community need", "suggest a facility", "প্রস্তাব"
    ])
    if is_recommend_query:
        if any(k in q_lower for k in ["my recommendations", "track recommendation", "proposal status"]):
            add_action("My Recommendations", "/citizen/my-recommendations", "Track status and agency reviews of your proposals")
            add_action("Recommend a Facility", "/citizen/recommendation", "Propose a new civic facility for your area")
        else:
            add_action("Recommend a Facility", "/citizen/recommendation", "Propose a new civic facility for your area")
            add_action("My Recommendations", "/citizen/my-recommendations", "Track status and agency reviews of your proposals")

    # Priority 5: Interactive Map / Facility Search
    is_map_query = any(k in q_lower for k in [
        "map", "find nearby", "facilities", "dustbin", "toilet", "drinking water", "parking", "location", "browse facilities", "gis", "ম্যাপ"
    ])
    if is_map_query and not is_report_query:
        add_action("Explore Map & Facilities", "/map", "Browse GIS map with live operational facilities in Kolkata")

    # Priority 6: Authentication & Password
    if any(k in q_lower for k in ["login", "sign in", "log in", "লগইন"]):
        add_action("Sign In to Account", "/login", "Access your citizen or officer account")
    if any(k in q_lower for k in ["register", "sign up", "create account", "new citizen", "registration", "নিবন্ধন"]):
        add_action("Register Account", "/register", "Join Amar Sohor as a citizen")
    if any(k in q_lower for k in ["forgot password", "reset password", "password recovery"]):
        add_action("Reset Password", "/forgot-password", "Request a secure password reset link")

    # Priority 7: Agency Operations
    if any(k in q_lower for k in ["agency", "investigate", "assigned reports", "resolution proof", "50% ai", "officer"]):
        add_action("Agency Dashboard", "/agency/dashboard", "Agency officer operations portal")
        add_action("Assigned Reports", "/agency/reports", "Review and investigate assigned civic complaints")

    # Priority 8: Municipal Admin Console
    if any(k in q_lower for k in ["admin", "administrator", "municipal admin", "agency management", "allocate recommendation"]):
        add_action("Admin Dashboard", "/admin/dashboard", "Municipal administrator control panel")
        add_action("Agency Management", "/admin/agencies", "Manage agency partners and ward assignments")

    # Secondary inclusions based on answer content if slots remain
    if len(actions) < 3:
        if any(k in text for k in ["citizen dashboard", "your dashboard", "name button", "user profile"]) and not any(a.path == "/citizen/dashboard" for a in actions):
            add_action("Citizen Dashboard / Profile", "/citizen/dashboard", "Access citizen dashboard and profile")
        if any(k in text for k in ["report an issue", "report issue"]) and not any(a.path == "/map" for a in actions):
            add_action("Select Facility on Map to Report", "/map", "Pick a facility on the map to lodge an issue")
        if any(k in text for k in ["recommend a facility", "recommend facility"]) and not any(a.path == "/citizen/recommendation" for a in actions):
            add_action("Recommend a Facility", "/citizen/recommendation", "Propose a new civic facility")
        if any(k in text for k in ["view my reports", "my reports"]) and not any(a.path == "/citizen/my-reports" for a in actions):
            add_action("View My Reports", "/citizen/my-reports", "Track your submitted reports")
        if any(k in text for k in ["map", "facilities"]) and not any(a.path == "/map" for a in actions):
            add_action("Explore Map & Facilities", "/map", "Discover civic facilities across Kolkata")

    # Fallback if nothing matched
    if not actions:
        add_action("Citizen Dashboard / Profile", "/citizen/dashboard", "Access your citizen dashboard and account")
        add_action("Explore Map & Facilities", "/map", "Discover civic facilities across Kolkata")

    return actions[:3]


def answer_question(message: str) -> ChatResponse:
    """Generate an authoritative answer grounded in the project knowledge base via Gemini."""
    question = message.strip()
    if not question:
        raise ValueError("A question is required")

    facility_count_answer = get_facility_count_answer(question)
    if facility_count_answer is not None:
        return ChatResponse(
            answer=facility_count_answer,
            sources=["live_facility_counts"],
            actions=[
                ActionButton(
                    label="Explore Facilities on Map",
                    path="/map",
                    description="View live public facilities across Kolkata on the GIS map",
                )
            ],
        )

    compiled_context, all_sources = get_compiled_knowledge_base()
    client = _get_gemini_client()

    prompt = (
        f"<project_reference_documentation>\n"
        f"{compiled_context}\n"
        f"</project_reference_documentation>\n\n"
        f"User Question: {question}\n\n"
        f"Please provide an accurate, helpful, and concise answer based strictly on the project documentation above."
    )

    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                temperature=0.2,
            ),
        )
    except APIError as exc:
        raise GeminiError(f"Gemini API error: {exc.message}") from exc
    except Exception as exc:
        raise GeminiError(f"Failed to communicate with Gemini API: {str(exc)}") from exc

    if not response or not response.text:
        raise GeminiError("Gemini returned an empty response.")

    # Identify most relevant source guides based on keywords in question and answer
    relevant_sources = []
    q_lower = (question + " " + response.text).lower()
    for src in all_sources:
        stem = src.replace(".md", "").replace("_", " ")
        if any(w in q_lower for w in stem.split()):
            relevant_sources.append(src)

    if not relevant_sources:
        relevant_sources = ["project_overview.md"]

    actions = resolve_action_buttons(question, response.text, relevant_sources)

    return ChatResponse(
        answer=response.text.strip(),
        sources=relevant_sources[:3],
        actions=actions,
    )
