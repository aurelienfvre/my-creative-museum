"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export default function useSearchDialog(dialog, input, scope) {
  const closing = useRef(false);
  const { contextSafe } = useGSAP({ scope });
  const openSearch = contextSafe(() => {
    const node = dialog.current;
    if (node.open || closing.current) return;
    gsap.killTweensOf(node);
    node.showModal();
    input.current.focus();
    gsap.fromTo(
      node,
      { opacity: 0, y: -16, "--search-backdrop": 0 },
      {
        opacity: 1,
        y: 0,
        "--search-backdrop": 1,
        duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? 0
          : 0.4,
        ease: "museum",
      },
    );
  });
  const closeSearch = contextSafe((afterClose) => {
    const node = dialog.current;
    if (!node?.open || closing.current) return;
    closing.current = true;
    gsap.killTweensOf(node);
    gsap.to(node, {
      opacity: 0,
      y: -12,
      "--search-backdrop": 0,
      duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? 0
        : 0.3,
      ease: "power2.inOut",
      onComplete: () => {
        node.close();
        closing.current = false;
        if (typeof afterClose === "function") afterClose();
      },
    });
  });
  return { openSearch, closeSearch };
}
