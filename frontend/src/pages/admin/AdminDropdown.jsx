import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function AdminDropdown({ id, value, onChange, options, placeholder, className = "", menuClassName = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectedOption = options.find((option) => option.value === value);
  const SelectedIcon = selectedOption?.icon;

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!dropdownRef.current?.contains(event.target)) setIsOpen(false);
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={dropdownRef} className={`admin-select-wrap ${isOpen ? "z-40" : ""} ${className}`}>
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="admin-form-input flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-left"
      >
        <span className="flex min-w-0 items-center gap-2">
          {SelectedIcon && <SelectedIcon size={16} className="shrink-0 text-cyan-200" aria-hidden="true" />}
          <span className={`truncate ${selectedOption ? "text-white" : "text-white/45"}`}>
            {selectedOption?.label || placeholder}
          </span>
        </span>
        <ChevronDown className={`admin-select-chevron ${isOpen ? "admin-select-chevron-open" : ""}`} size={18} aria-hidden="true" />
      </button>

      {isOpen && (
        <div className={`admin-dropdown-menu ${menuClassName}`} role="listbox" aria-labelledby={id}>
          {options.map((option) => {
            const OptionIcon = option.icon;
            const isSelected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`admin-dropdown-option ${isSelected ? "admin-dropdown-option-selected" : ""}`}
              >
                <span className="flex items-center gap-2">
                  {OptionIcon && <OptionIcon size={15} aria-hidden="true" />}
                  <span>{option.label}</span>
                </span>
                {isSelected && <Check size={16} aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminDropdown;
