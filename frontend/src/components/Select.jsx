import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

const ACCENTS = {
  lime: { ring: "focus-visible:ring-lime-300/40", open: "border-lime-300/60", active: "bg-lime-300/15 text-lime-200", check: "text-lime-300" },
  cyan: { ring: "focus-visible:ring-cyan-300/40", open: "border-cyan-300/60", active: "bg-cyan-300/15 text-cyan-100", check: "text-cyan-300" },
};

const SIZES = {
  sm: "min-h-[34px] px-3 py-1.5 text-xs",
  md: "min-h-[46px] px-3.5 py-2.5 text-xs sm:text-sm",
};

/**
 * Accessible, theme-aware dropdown replacing native <select>.
 * onChange receives a select-like event ({ target: { name, value } }) so existing handlers keep working.
 */
export default function Select({
  id,
  name,
  value,
  onChange,
  options,
  placeholder = "Select…",
  icon: Icon,
  accent = "lime",
  size = "md",
  light = false,
  required = false,
  disabled = false,
  className = "",
  "aria-label": ariaLabel,
}) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const listRef = useRef(null);
  const listId = useId();
  const tone = ACCENTS[accent] || ACCENTS.lime;

  const selectedIndex = options.findIndex((o) => String(o.value) === String(value));
  const selected = options[selectedIndex];

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  useEffect(() => {
    if (open && highlight >= 0) {
      listRef.current?.children[highlight]?.scrollIntoView({ block: "nearest" });
    }
  }, [open, highlight]);

  const openList = () => {
    if (disabled) return;
    setHighlight(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  };

  const choose = (index) => {
    const option = options[index];
    if (!option || option.disabled) return;
    onChange?.({ target: { name, value: String(option.value) } });
    setOpen(false);
    buttonRef.current?.focus();
  };

  const move = (delta) => {
    if (!options.length) return;
    let next = highlight;
    for (let i = 0; i < options.length; i += 1) {
      next = (next + delta + options.length) % options.length;
      if (!options[next].disabled) break;
    }
    setHighlight(next);
  };

  const onKeyDown = (e) => {
    if (disabled) return;
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openList();
      }
      return;
    }
    if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
    else if (e.key === "Home") { e.preventDefault(); setHighlight(0); }
    else if (e.key === "End") { e.preventDefault(); setHighlight(options.length - 1); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choose(highlight); }
    else if (e.key === "Escape") { e.preventDefault(); setOpen(false); }
    else if (e.key === "Tab") setOpen(false);
    else if (e.key.length === 1) {
      const start = highlight + 1;
      const key = e.key.toLowerCase();
      for (let i = 0; i < options.length; i += 1) {
        const idx = (start + i) % options.length;
        if (String(options[idx].label).toLowerCase().startsWith(key)) { setHighlight(idx); break; }
      }
    }
  };

  const trigger = light
    ? "border-slate-300 bg-white text-slate-900 hover:border-slate-400"
    : "border-white/15 bg-white/[0.06] text-white hover:border-white/30 hover:bg-white/[0.09]";
  const panel = light
    ? "border-slate-200 bg-white text-slate-800 shadow-xl shadow-slate-900/10"
    : "border-white/10 bg-[#0b1220]/95 text-white/85 shadow-2xl shadow-black/50 backdrop-blur-xl";
  const idle = light ? "hover:bg-slate-100" : "hover:bg-white/[0.06]";

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        ref={buttonRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel}
        aria-activedescendant={open && highlight >= 0 ? `${listId}-${highlight}` : undefined}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={`flex w-full items-center gap-2.5 rounded-xl border text-left outline-none transition focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${SIZES[size]} ${trigger} ${tone.ring} ${open ? tone.open : ""}`}
      >
        {Icon && <Icon size={size === "sm" ? 14 : 16} className={`shrink-0 ${light ? "text-slate-500" : "text-white/50"}`} aria-hidden="true" />}
        <span className={`min-w-0 flex-1 truncate ${selected ? "" : light ? "text-slate-400" : "text-white/40"}`}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={16} aria-hidden="true" className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""} ${light ? "text-slate-500" : "text-white/50"}`} />
      </button>

      {required && (
        <input
          tabIndex={-1}
          aria-hidden="true"
          required
          value={value ?? ""}
          onChange={() => {}}
          onInvalid={() => buttonRef.current?.focus()}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px w-full opacity-0"
        />
      )}

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          className={`absolute left-0 right-0 z-50 mt-2 max-h-64 overflow-auto rounded-xl border p-1.5 text-xs sm:text-sm ${panel}`}
        >
          {options.map((option, index) => {
            const isSelected = index === selectedIndex;
            const isActive = index === highlight;
            return (
              <li
                key={option.value}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled || undefined}
                onPointerEnter={() => setHighlight(index)}
                onPointerDown={(e) => e.preventDefault()}
                onClick={() => choose(index)}
                className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 transition ${
                  option.disabled ? "cursor-not-allowed opacity-40" : isActive ? tone.active : idle
                } ${isSelected ? "font-semibold" : ""}`}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && <Check size={15} className={`shrink-0 ${tone.check}`} aria-hidden="true" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
