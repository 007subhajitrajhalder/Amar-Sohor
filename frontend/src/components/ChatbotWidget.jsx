import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  ChevronDown,
  Loader2,
  FileText,
  AlertCircle,
  ArrowUpRight,
  Compass,
  RefreshCw,
  ExternalLink,
  Layers,
} from "lucide-react";
import { apiRequest, getStoredToken } from "../api/client";

// Actionable mapping from static knowledge documents to actual clickable website routes
const SOURCE_SHORTCUTS = {
  "citizen_guide.md": {
    label: "Explore Map & Facilities",
    path: "/map",
    badge: "Map & Status",
    hint: "View all public facilities and live operational statuses",
  },
  "ai_validation_guide.md": {
    label: "Select Facility on Map to Report",
    path: "/map",
    badge: "AI Image Engine",
    hint: "Pick a facility on the interactive map to start an AI-verified report",
  },
  "complaint_workflow.md": {
    label: "Report Issue / Track Grievances",
    path: "/citizen/my-reports",
    badge: "Grievances",
    hint: "Lodge complaints, monitor investigations, and see repairs",
  },
  "recommendation_workflow.md": {
    label: "Propose a New Facility",
    path: "/citizen/recommendation",
    badge: "Recommendations",
    hint: "Advocate for missing facilities in your neighborhood",
  },
  "agency_guide.md": {
    label: "Assigned Reports",
    path: "/agency/reports",
    badge: "Agency Ops",
    hint: "Manage assigned facilities, field investigations, and resolutions",
  },
  "admin_guide.md": {
    label: "Admin Complaints & Governance",
    path: "/admin/complaints",
    badge: "Admin Console",
    hint: "Global grievance registry, recommendations, and platform governance",
  },
  "user_account_guide.md": {
    label: "Account & Security",
    path: "/login",
    badge: "Auth & Roles",
    hint: "Sign in, registration, and role-based permissions",
  },
  "project_overview.md": {
    label: "Smart City Platform Map",
    path: "/map",
    badge: "Overview",
    hint: "GIS infrastructure and public amenities across Kolkata",
  },
  live_facility_counts: {
    label: "Live Facility Counts",
    path: "/map",
    badge: "Facility Data",
    hint: "Browse public facilities by category",
  },
};

const SUGGESTIONS = [
  "How many facilities are in the database?",
  "How does AI photo validation work?",
  "How to report a broken tap or water point?",
  "What is the facility recommendation workflow?",
  "What is the 50% AI agency rejection rule?",
  "Can citizens leave ratings or reviews on facilities?",
  "আমার শহরে কিভাবে অভিযোগ জানাতে পারি?",
];

// Helper to resolve routes with template placeholders like {facilityId} to safe in-app destinations
// Note: In Amar Sohor, reporting an issue requires selecting a facility on the map first.
// Any plain route pointing to /citizen/report-issue is safely redirected to the MapViewPage (/map).
function resolveSafePath(rawPath) {
  if (!rawPath) return "/map";
  let clean = rawPath.replace(/[.,;:!?)\]`*]+$/, "").trim();

  if (
    clean === "/citizen/report-issue" ||
    clean === "/citizen/report-issue/" ||
    clean.startsWith("/citizen/report-issue?") ||
    clean.includes("{facilityId}")
  ) {
    return "/map";
  }

  if (
    clean === "/agency/resolved-reports" ||
    clean === "/agency/resolved-reports/" ||
    clean.startsWith("/agency/resolved-reports")
  ) {
    return "/agency/reports";
  }

  if (clean.includes("{reportId}")) {
    if (clean.startsWith("/agency")) return "/agency/reports";
    if (clean.startsWith("/admin")) return "/admin/complaints";
    return "/citizen/my-reports";
  }
  if (clean.includes("{recommendationId}")) {
    if (clean.startsWith("/agency")) return "/agency/recommendations";
    if (clean.startsWith("/admin")) return "/admin/recommendations";
    return "/citizen/my-recommendations";
  }
  if (clean.includes("{agencyId}")) return "/admin/agencies";
  return clean;
}

// Derive actionable navigation buttons to the exact page the text suggests
function resolveActionButtonsForMessage(msg) {
  if (msg.actions && Array.isArray(msg.actions) && msg.actions.length > 0) {
    // Ensure any action pointing to /citizen/report-issue is redirected to /map
    return msg.actions.map((act) => {
      if (act.path === "/citizen/report-issue" || act.path?.startsWith("/citizen/report-issue")) {
        return {
          ...act,
          label: act.label?.includes("Map") ? act.label : "Select Facility on Map to Report",
          path: "/map",
          description: act.description || "Locate facility on the interactive map to report an issue",
        };
      }
      return act;
    });
  }

  const text = (msg.text || "").toLowerCase();
  const detected = [];
  const seen = new Set();

  const add = (label, path, description) => {
    const safe = resolveSafePath(path);
    const key = `${label}-${safe}`;
    if (!seen.has(key)) {
      seen.add(key);
      detected.push({ label, path: safe, description });
    }
  };

  // 1. User Profile & Citizen Dashboard
  if (
    text.includes("profile") ||
    text.includes("user profile") ||
    text.includes("my profile") ||
    text.includes("citizen dashboard") ||
    text.includes("user dashboard") ||
    text.includes("my account") ||
    text.includes("account details") ||
    text.includes("name button") ||
    text.includes("save changes") ||
    text.includes("edit profile") ||
    text.includes("প্রোফাইল")
  ) {
    add("Citizen Dashboard / Profile", "/citizen/dashboard", "View and update your personal details, profile, and civic activities");
  }

  // 2. Issue Reporting / Grievance Submission -> leads directly to MapViewPage (/map)
  // so the user can select the facility to lodge the report
  if (
    text.includes("report an issue") ||
    text.includes("report issue") ||
    text.includes("broken tap") ||
    text.includes("damaged dustbin") ||
    text.includes("lodge complaint") ||
    text.includes("grievance") ||
    text.includes("complaint") ||
    text.includes("broken") ||
    text.includes("leakage") ||
    text.includes("defective") ||
    text.includes("damage") ||
    text.includes("অভিযোগ")
  ) {
    add("Select Facility on Map to Report", "/map", "Pick the defective facility on the interactive map");
    add("Explore Map & Facilities", "/map", "Discover civic facilities and live operational statuses");
  }

  // 3. Recommendations / Proposing new facilities
  if (
    text.includes("recommend") ||
    text.includes("propose") ||
    text.includes("missing facility") ||
    text.includes("new facility") ||
    text.includes("community need") ||
    text.includes("প্রস্তাব")
  ) {
    add("Recommend a Facility", "/citizen/recommendation", "Propose a new civic facility for your area");
    add("My Recommendations", "/citizen/my-recommendations", "Track status and agency reviews of your proposals");
  }

  // 4. Tracking Reports
  if (
    text.includes("my reports") ||
    text.includes("view my reports") ||
    text.includes("track report") ||
    text.includes("report status") ||
    text.includes("check status")
  ) {
    add("View My Reports", "/citizen/my-reports", "Track status and view resolution proofs");
  }

  // 5. Map & GIS Facility Discovery
  if (
    text.includes("map") ||
    text.includes("find nearby") ||
    text.includes("facilities") ||
    text.includes("facility") ||
    text.includes("dustbin") ||
    text.includes("toilet") ||
    text.includes("drinking water") ||
    text.includes("parking") ||
    text.includes("gis") ||
    text.includes("ম্যাপ")
  ) {
    add("Explore Map & Facilities", "/map", "Discover civic facilities and live operational statuses");
  }

  // 6. User Accounts & Authentication
  if (text.includes("login") || text.includes("sign in") || text.includes("log in") || text.includes("লগইন")) {
    add("Sign In to Account", "/login", "Access citizen or officer account");
  }
  if (text.includes("register") || text.includes("sign up") || text.includes("create account") || text.includes("নিবন্ধন")) {
    add("Register Account", "/register", "Join Amar Sohor civic platform");
  }
  if (text.includes("forgot password") || text.includes("reset password")) {
    add("Reset Password", "/forgot-password", "Request password recovery");
  }

  // 7. Agency Operations
  if (
    text.includes("agency dashboard") ||
    text.includes("assigned reports") ||
    text.includes("resolution proof") ||
    text.includes("50% ai") ||
    text.includes("agency")
  ) {
    add("Agency Dashboard", "/agency/dashboard", "Agency officer operations portal");
    add("Assigned Reports", "/agency/reports", "Review assigned complaint tickets");
  }

  // 8. Municipal Admin Console
  if (
    text.includes("admin dashboard") ||
    text.includes("municipal admin") ||
    text.includes("agency management") ||
    text.includes("allocate recommendation")
  ) {
    add("Admin Dashboard", "/admin/dashboard", "Platform administration console");
    add("Agency Management", "/admin/agencies", "Manage agency partners and ward assignments");
  }

  // Fallback to ensure every conversation has actionable navigation
  if (detected.length === 0) {
    add("Citizen Dashboard / Profile", "/citizen/dashboard", "Access citizen dashboard and profile");
    add("Explore Map & Facilities", "/map", "Discover civic facilities across Kolkata");
  }

  return detected.slice(0, 3);
}

export default function ChatbotWidget() {
  const navigate = useNavigate();
  const location = useLocation();

  // Authentication State: Only show chatbot if the user is signed in
  const [signedIn, setSignedIn] = useState(() => Boolean(getStoredToken()));

  useEffect(() => {
    const sync = () => setSignedIn(Boolean(getStoredToken()));
    window.addEventListener("authChanged", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("authChanged", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      text: "Hello! I am **Sohor Bondhu**, your Amar Sohor AI assistant, powered by Google Gemini.\n\nAsk about facility totals and categories, finding facilities on our interactive map, lodging grievances with AI photo verification, or proposing new civic infrastructure in Kolkata!",
      sources: ["project_overview.md", "citizen_guide.md"],
      actions: [
        { label: "Explore Map & Facilities", path: "/map", description: "Interactive GIS map with live statuses" },
        { label: "Select Facility on Map to Report", path: "/map", description: "Pick a facility on the map to lodge a verified report" },
        { label: "Recommend a Facility", path: "/citizen/recommendation", description: "Propose new public amenities" },
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastFailedQuery, setLastFailedQuery] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages, loading]);

  // Do NOT render anything if the user is not authenticated
  if (!signedIn) {
    return null;
  }

  const handleNavigate = (path) => {
    let safeDestination = resolveSafePath(path);
    if (safeDestination === "/citizen/report-issue" || safeDestination.startsWith("/citizen/report-issue")) {
      safeDestination = "/map";
    }
    if (location.pathname !== safeDestination) {
      navigate(safeDestination);
    }
  };

  const handleSend = async (queryText) => {
    const textToSend = (typeof queryText === "string" ? queryText : input).trim();
    if (!textToSend || loading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLastFailedQuery(null);
    setLoading(true);

    try {
      const res = await apiRequest("/chatbot/chat", {
        method: "POST",
        auth: true,
        body: { message: textToSend },
      });

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: res.answer || "No response received.",
        sources: res.sources || [],
        actions: res.actions || [],
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errMsg = err.message || "Unable to reach the AI assistant.";
      setLastFailedQuery(textToSend);

      let hintText = errMsg;
      if (errMsg.includes("GEMINI_API_KEY")) {
        hintText =
          "**Gemini API Key Needed**: Please set your `GEMINI_API_KEY` in `backend/.env`. You can obtain a free key from Google AI Studio.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          isError: true,
          text: `⚠️ **Connection Issue**: ${hintText}`,
          sources: [],
          actions: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome-reset",
        role: "assistant",
        text: "Conversation cleared. How else can I assist you with Amar Sohor?",
        sources: ["project_overview.md"],
        actions: [
          { label: "Explore Map & Facilities", path: "/map", description: "Interactive GIS map" },
          { label: "Select Facility on Map to Report", path: "/map", description: "Pick a facility on the map to report" },
        ],
      },
    ]);
    setLastFailedQuery(null);
  };

  // Convert raw text into rich formatted elements with interactive in-app route pills
  const renderFormattedText = (text) => {
    const ROUTE_REGEX =
      /(\/(?:citizen|agency|admin|facilities|map|login|register|forgot-password|reset-password)[a-zA-Z0-9_\-\/{}]*)/g;
    const MARKDOWN_LINK_REGEX = /\[([^\]]+)\]\(([^)]+)\)/g;

    return text.split("\n").map((line, lineIdx) => {
      let trimmed = line.trim();
      const isBullet = trimmed.startsWith("- ") || trimmed.startsWith("* ");
      if (isBullet) {
        trimmed = trimmed.substring(2);
      }

      // Check if line is empty (paragraph break)
      if (trimmed === "") {
        return <div key={lineIdx} className="h-2" />;
      }

      // Split line into markdown chunks (bold, code, links)
      const segments = [];
      let lastIndex = 0;
      let match;

      while ((match = MARKDOWN_LINK_REGEX.exec(trimmed)) !== null) {
        if (match.index > lastIndex) {
          segments.push({ type: "text", content: trimmed.substring(lastIndex, match.index) });
        }
        segments.push({ type: "link", label: match[1], url: match[2] });
        lastIndex = MARKDOWN_LINK_REGEX.lastIndex;
      }
      if (lastIndex < trimmed.length) {
        segments.push({ type: "text", content: trimmed.substring(lastIndex) });
      }

      const renderedSegments = segments.map((seg, sIdx) => {
        if (seg.type === "link") {
          const isInternal = seg.url.startsWith("/");
          if (isInternal) {
            return (
              <button
                key={sIdx}
                type="button"
                onClick={() => handleNavigate(seg.url)}
                className="inline-flex items-center gap-1 font-semibold text-lime-300 underline decoration-lime-400/50 hover:text-lime-200 transition-colors cursor-pointer"
              >
                <span>{seg.label}</span>
                <ArrowUpRight size={11} className="shrink-0" />
              </button>
            );
          }
          return (
            <a
              key={sIdx}
              href={seg.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-cyan-300 underline decoration-cyan-400/50 hover:text-cyan-200 transition-colors"
            >
              <span>{seg.label}</span>
              <ExternalLink size={10} className="shrink-0" />
            </a>
          );
        }

        // Process standard text for **bold**, `code`, and in-app `/routes`
        const textParts = seg.content.split(/(\*\*.*?\*\*|`.*?`)/g);

        return textParts.map((part, pIdx) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            const inner = part.slice(2, -2);
            return (
              <strong key={pIdx} className="font-semibold text-white">
                {renderRouteBadges(inner)}
              </strong>
            );
          }
          if (part.startsWith("`") && part.endsWith("`")) {
            const inner = part.slice(1, -1);
            // If the code snippet is an internal route (e.g. `/map`), turn it into an interactive route badge
            if (inner.startsWith("/") && ROUTE_REGEX.test(inner)) {
              return renderRouteBadgeComponent(inner, pIdx);
            }
            return (
              <code
                key={pIdx}
                className="rounded bg-black/50 px-1 py-0.5 font-mono text-[11px] text-cyan-300 border border-cyan-500/20"
              >
                {inner}
              </code>
            );
          }
          return renderRouteBadges(part, pIdx);
        });
      });

      return (
        <div
          key={lineIdx}
          className={`${
            isBullet
              ? "pl-4 relative before:content-['•'] before:absolute before:left-1 before:text-lime-400"
              : ""
          } my-0.5 leading-relaxed text-[12px]`}
        >
          {renderedSegments}
        </div>
      );
    });
  };

  // Helper to detect plain route mentions inside prose and wrap them with clickable badges
  const renderRouteBadges = (str, keyPrefix = 0) => {
    const ROUTE_REGEX =
      /(\/(?:citizen|agency|admin|facilities|map|login|register|forgot-password|reset-password)[a-zA-Z0-9_\-\/{}]*)/g;
    const parts = str.split(ROUTE_REGEX);

    return parts.map((chunk, idx) => {
      if (chunk.startsWith("/") && ROUTE_REGEX.test(chunk)) {
        return renderRouteBadgeComponent(chunk, `${keyPrefix}-${idx}`);
      }
      return <span key={idx}>{chunk}</span>;
    });
  };

  // Clickable in-app navigation badge
  const renderRouteBadgeComponent = (rawRoute, key) => {
    const safeRoute = resolveSafePath(rawRoute);
    return (
      <button
        key={key}
        type="button"
        onClick={() => handleNavigate(safeRoute)}
        title={`Navigate to ${safeRoute}`}
        className="inline-flex items-center gap-1 mx-1 rounded-md border border-lime-400/40 bg-lime-400/10 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-lime-300 hover:border-lime-300 hover:bg-lime-400/25 hover:text-white transition-all shadow-xs cursor-pointer group"
      >
        <span>{safeRoute === "/map" && rawRoute.includes("report-issue") ? "Select on /map" : rawRoute}</span>
        <ArrowUpRight size={10} className="shrink-0 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </button>
    );
  };

  return (
    <aside aria-label="Sohor Bondhu AI Assistant" className="fixed bottom-5 right-5 z-[99999]">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-600 via-emerald-500 to-lime-400 p-0.5 shadow-2xl shadow-emerald-950/50 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
          aria-label="Open Sohor Bondhu"
        >
          <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-950/90 text-lime-300 transition-colors group-hover:bg-slate-900/80">
            <Sparkles size={24} className="animate-pulse" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-400 opacity-75" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-lime-500 text-[9px] font-bold text-slate-950 items-center justify-center">
              AI
            </span>
          </span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="flex h-[580px] w-[375px] flex-col overflow-hidden rounded-2xl border border-white/15 bg-slate-950/95 text-slate-100 shadow-2xl shadow-black/90 backdrop-blur-2xl sm:w-[420px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 bg-slate-900/90 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-lime-400 text-slate-950 shadow-md">
                <Bot size={20} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm font-bold text-white tracking-wide">Sohor Bondhu Ai</h2>
                  <span className="rounded bg-lime-400/20 border border-lime-400/30 px-1.5 py-0.2 text-[9px] font-semibold text-lime-300 uppercase tracking-wider">
                    Live
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                  Smart City Assistant Chatbot
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={clearChat}
                title="Clear conversation"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                <Trash2 size={15} />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Minimize chat"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronDown size={18} />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 space-y-3.5 overflow-y-auto p-4 text-xs">
            {messages.map((msg) => {
              const actionButtons = resolveActionButtonsForMessage(msg);
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mt-0.5">
                      <Bot size={15} />
                    </div>
                  )}

                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-cyan-600 to-emerald-600 text-white shadow-md rounded-tr-xs"
                        : msg.isError
                        ? "bg-rose-950/40 border border-rose-500/40 text-rose-200 rounded-tl-xs"
                        : "bg-slate-900/95 border border-white/10 text-slate-200 shadow-sm rounded-tl-xs"
                    }`}
                  >
                    {renderFormattedText(msg.text)}

                    {/* Actionable Navigation Button(s) to the suggested page */}
                    {msg.role === "assistant" && !msg.isError && actionButtons.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-white/10 space-y-2">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-lime-400 uppercase tracking-wider">
                          <Compass size={12} className="text-lime-400" />
                          <span>Actionable Navigation:</span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          {actionButtons.map((btn, bIdx) => (
                            <button
                              key={bIdx}
                              type="button"
                              onClick={() => handleNavigate(btn.path)}
                              title={`Navigate directly to ${btn.label}`}
                              className="flex items-center justify-between w-full rounded-xl border border-lime-400/40 bg-gradient-to-r from-lime-500/15 via-emerald-500/15 to-cyan-500/15 p-2.5 text-xs font-semibold text-white hover:border-lime-300 hover:from-lime-400/25 hover:to-emerald-400/25 hover:shadow-lg hover:shadow-lime-950/40 transition-all duration-200 group cursor-pointer text-left"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-lime-400 text-slate-950 font-bold group-hover:scale-110 transition-transform shadow-xs">
                                  <ArrowUpRight size={14} />
                                </span>
                                <div className="truncate">
                                  <span className="block text-xs font-bold text-lime-200 group-hover:text-white transition-colors">
                                    {btn.label}
                                  </span>
                                  {btn.description && (
                                    <span className="block text-[10px] text-slate-400 group-hover:text-slate-300 truncate">
                                      {btn.description}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <span className="shrink-0 ml-2 rounded-md bg-lime-400/20 border border-lime-400/30 px-2 py-0.5 text-[10px] font-bold text-lime-300 group-hover:bg-lime-400 group-hover:text-slate-950 transition-colors">
                                {btn.path === "/map" ? "Open Map →" : "Open Page →"}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Reference Sources */}
                    {msg.sources && msg.sources.length > 0 && !msg.isError && (
                      <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <FileText size={10} className="text-slate-500" /> Reference: {msg.sources.join(", ")}
                        </span>
                      </div>
                    )}

                    {/* Retry option in error state */}
                    {msg.isError && lastFailedQuery && (
                      <div className="mt-2 pt-2 border-t border-rose-500/20 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleSend(lastFailedQuery)}
                          className="inline-flex items-center gap-1 rounded-lg bg-rose-500/20 border border-rose-500/40 px-2 py-1 text-[10px] font-semibold text-rose-200 hover:bg-rose-500/30 transition-colors cursor-pointer"
                        >
                          <RefreshCw size={10} /> Retry Question
                        </button>
                      </div>
                    )}
                  </div>

                  {msg.role === "user" && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-600/30 text-cyan-200 border border-cyan-500/40 mt-0.5">
                      <User size={15} />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex items-center gap-2.5 text-xs text-slate-400">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <Bot size={15} />
                </div>
                <div className="flex items-center gap-2 rounded-2xl bg-slate-900/90 border border-white/10 px-3.5 py-2">
                  <Loader2 size={13} className="animate-spin text-lime-400" />
                  <span className="text-[11px] text-slate-300">Consulting Amar Sohor Knowledge Base...</span>
                </div>
              </div>
            )}

            {/* Interactive Suggested Questions (shown on fresh welcome) */}
            {messages.length === 1 && !loading && (
              <div className="mt-3 space-y-1.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles size={11} className="text-lime-400" /> Suggested Inquiries:
                </p>
                <div className="flex flex-col gap-1.5">
                  {SUGGESTIONS.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSend(item)}
                      className="text-left rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-slate-300 hover:border-lime-400/40 hover:bg-lime-400/10 hover:text-lime-200 transition-all duration-200 cursor-pointer flex items-center justify-between group"
                    >
                      <span>{item}</span>
                      <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 text-lime-300 transition-opacity shrink-0 ml-1" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="border-t border-white/10 bg-slate-900/90 p-3"
          >
            <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-black/50 px-3 py-1.5 focus-within:border-cyan-400 transition-colors">
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask about map, AI validation, complaints..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                className="flex-1 bg-transparent text-xs text-white placeholder-slate-400 outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Send message"
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-lime-400 text-slate-950 font-bold hover:bg-lime-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <Send size={13} />
              </button>
            </div>
            <p className="mt-1.5 text-center text-[9px] text-slate-400">
              Guidance links navigate directly within Amar Sohor.
            </p>
          </form>
        </div>
      )}
    </aside>
  );
}
