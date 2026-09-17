"use client";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { NavigationContext } from "@/contexts/navigation-context";

export default function useSearchNavigation(onClose) {
  const navigate = useContext(NavigationContext);
  const router = useRouter();
  const onNavigate = (event) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    event.preventDefault();
    const href = event.currentTarget.getAttribute("href");
    onClose(() => {
      if (
        !navigate ||
        new URL(href, window.location.href).pathname ===
          window.location.pathname
      )
        router.push(href);
      else navigate(href);
    });
  };
  return onNavigate;
}
