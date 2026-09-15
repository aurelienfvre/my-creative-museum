"use client";
import { useRef } from "react";
import { useCustomCursor } from "./custom-cursor/use-custom-cursor";
export default function CustomCursor() {
  const cursor = useRef(null);
  useCustomCursor(cursor);
  return (
    <div
      className="custom-cursor"
      popover="manual"
      ref={cursor}
      aria-hidden="true"
    >
      <div className="cursor-badge-motion">
        <div className="cursor-cross">
          <svg
            aria-hidden="true"
            viewBox="0 0 28 28"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          >
            <path d="M14 1v26M1 14h26" />
          </svg>
        </div>
        <div className="cursor-label">
          <span>Voir l’œuvre</span>
        </div>
      </div>
    </div>
  );
}
