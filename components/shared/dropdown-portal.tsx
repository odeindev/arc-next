// shared/ui/dropdown-portal/DropdownPortal.tsx

import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";

interface DropdownPortalProps {
  isOpen: boolean;
  anchorRef: React.RefObject<HTMLElement | null>;
  onClose: () => void;
  children: React.ReactNode;
}

interface Position {
  top: number;
  left: number;
  width: number;
}

export const DropdownPortal: React.FC<DropdownPortalProps> = ({
  isOpen,
  anchorRef,
  onClose,
  children,
}) => {
  const [position, setPosition] = useState<Position>({
    top: 0,
    left: 0,
    width: 0,
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (!anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const width = rect.width;

    // Не выходить за правый край экрана
    const left = Math.min(rect.left, viewportWidth - width - 10);

    setPosition({ top: rect.bottom, left, width });
  }, [anchorRef]);

  useEffect(() => {
    if (!isOpen) return;

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        dropdownRef.current?.contains(target) ||
        anchorRef.current?.contains(target)
      )
        return;
      onClose();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      ref={dropdownRef}
      role="listbox"
      aria-orientation="vertical"
      className="fixed z-50 overflow-hidden rounded-lg border border-slate-700 bg-slate-800 shadow-lg"
      style={{
        top: position.top,
        left: position.left,
        width: position.width,
      }}
    >
      {children}
    </div>,
    document.body,
  );
};
