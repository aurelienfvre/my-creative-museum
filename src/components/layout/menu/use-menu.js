"use client";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useRef, useState } from "react";
import { NavigationContext } from "@/contexts/navigation-context";
import { gsap, useGSAP } from "@/lib/gsap";
import animateMenuOpen from "./animate-menu-open";

export default function useMenu() {
  const scope = useRef(null),
    dialog = useRef(null),
    opener = useRef(null),
    busy = useRef(false),
    overflow = useRef("");
  const [opened, setOpened] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const navigate = useContext(NavigationContext);
  const { contextSafe } = useGSAP(
    () => () => {
      document.documentElement.style.overflow = overflow.current;
    },
    { scope },
  );
  const reduced = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const open = contextSafe(() => {
    if (busy.current || dialog.current.open) return;
    busy.current = true;
    overflow.current = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    dialog.current.showModal();
    setOpened(true);
    animateMenuOpen(dialog, busy, reduced);
  });
  const close = contextSafe((after) => {
    if (!dialog.current.open) {
      after?.();
      return;
    }
    // Une fermeture pendant l’entrée interrompt proprement la timeline en cours.
    gsap.killTweensOf(dialog.current);
    busy.current = true;
    gsap.to(dialog.current, {
      xPercent: -105,
      duration: reduced() ? 0 : 0.65,
      ease: "curtain",
      onComplete: () => {
        dialog.current.close();
        document.documentElement.style.overflow = overflow.current;
        busy.current = false;
        setOpened(false);
        if (after) after();
        else opener.current?.focus({ preventScroll: true });
      },
    });
  });
  const select = (event, href) => {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.altKey ||
      event.shiftKey ||
      event.button !== 0
    )
      return;
    event.preventDefault();
    close(() => {
      if (href === pathname || href.startsWith(`${pathname}#`))
        router.push(href);
      else navigate(href);
    });
  };
  return { scope, dialog, opener, opened, pathname, open, close, select };
}
