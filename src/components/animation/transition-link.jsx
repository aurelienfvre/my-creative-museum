"use client";
import Link from "next/link";
import { useContext } from "react";
import { NavigationContext } from "@/contexts/navigation-context";

export default function TransitionLink({
  href,
  children,
  onClick,
  onNavigate,
  ...props
}) {
  const navigate = useContext(NavigationContext);
  return (
    <Link
      {...props}
      href={href}
      onClick={onClick}
      onNavigate={(event) => {
        let cancelled = false;
        onNavigate?.({
          preventDefault() {
            cancelled = true;
            event.preventDefault();
          },
        });
        if (
          cancelled ||
          !navigate ||
          typeof href !== "string" ||
          props.replace ||
          props.scroll === false ||
          props.transitionTypes
        )
          return;
        const url = new URL(href, window.location.href);
        if (url.pathname === window.location.pathname) return;
        event.preventDefault();
        navigate(href);
      }}
    >
      {children}
    </Link>
  );
}
