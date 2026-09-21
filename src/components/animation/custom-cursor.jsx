"use client";
import { useRef } from "react";
import { useCustomCursor } from "./custom-cursor/use-custom-cursor";
export default function CustomCursor() {
  const cursor = useRef(null);
  useCustomCursor(cursor);
  return (
    <div
      className="custom-cursor group/cursor fixed inset-auto top-0 left-0 m-0 p-0 size-0 border-0 overflow-visible bg-transparent text-ink pointer-events-none! opacity-0 z-[2147483647] backdrop:hidden pointer-coarse:hidden! motion-reduce:hidden!"
      popover="manual"
      ref={cursor}
      aria-hidden="true"
    >
      <div className="cursor-badge-motion absolute top-0 left-0">
        <div className="cursor-cross absolute size-[20px] -left-[10px] -top-[10px] text-ink group-data-[tone=light]/cursor:text-background [&_svg]:block [&_svg]:size-full transition-[transform,opacity] duration-[280ms] ease-[cubic-bezier(.22,1,.36,1)] group-data-[mode=link]/cursor:[transform:scale(.72)_rotate(45deg)] group-data-[mode=artwork]/cursor:opacity-0 group-data-[mode=artwork]/cursor:[transform:scale(.15)_rotate(90deg)]">
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
        <div className="cursor-label absolute top-0 left-0 w-max h-[36px] px-[16px] whitespace-nowrap grid place-items-center border-0 rounded-none bg-foreground text-background font-sans text-[13px] font-medium leading-[1.25] text-center opacity-0 [transform:translate(-50%,-50%)_scale(.18)] origin-center will-change-transform transition-[transform,opacity] duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-data-[mode=artwork]/cursor:opacity-100 group-data-[mode=artwork]/cursor:[transform:translate(-50%,-50%)_scale(1)]">
          <span>Voir l’œuvre</span>
        </div>
      </div>
    </div>
  );
}
