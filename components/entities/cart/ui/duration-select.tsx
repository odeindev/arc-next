// entities/cart/ui/DurationSelect.tsx

import React, { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { DropdownPortal } from "@/components/shared";
import { Duration } from "../model/types";
import { DURATION_OPTIONS } from "../model/duration";

interface DurationSelectProps {
  value: Duration;
  onChange: (value: Duration) => void;
}

export const DurationSelect: React.FC<DurationSelectProps> = ({
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selectedLabel =
    DURATION_OPTIONS.find((opt) => opt.value === value)?.label ?? "30 дней";

  const handleSelect = (duration: Duration) => {
    onChange(duration);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        className="flex h-10 w-full items-center justify-between rounded-lg bg-slate-700 px-3 text-white transition-all hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Выбрать период подписки"
      >
        <span>{selectedLabel}</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <DropdownPortal
        isOpen={isOpen}
        anchorRef={buttonRef}
        onClose={() => setIsOpen(false)}
      >
        {DURATION_OPTIONS.map((option) => (
          <div
            key={option.value}
            role="option"
            aria-selected={value === option.value}
            tabIndex={0}
            className={`cursor-pointer px-4 py-3 text-white transition-colors hover:bg-slate-700 ${
              value === option.value ? "bg-amber-500/20 font-medium" : ""
            }`}
            onClick={() => handleSelect(option.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleSelect(option.value);
              }
            }}
          >
            {option.label}
          </div>
        ))}
      </DropdownPortal>
    </div>
  );
};
