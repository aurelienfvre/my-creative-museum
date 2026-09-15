"use client";
import Link from "next/link";
import { useContext } from "react";
import { NavigationContext } from "@/components/animation/page-transition";

export default function TransitionLink({ href, children, onClick, ...props }) {
  const navigate = useContext(NavigationContext);
  return (
    <Link
      {...props}
      href={href}
      onClick={(event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          props.target === "_blank" ||
          props.download
        )
          return;
        const url = new URL(href, window.location.href);
        if (
          url.origin !== window.location.origin ||
          url.pathname === window.location.pathname ||
          !navigate
        )
          return;
        event.preventDefault();
        navigate(href);
      }}
    >
      {children}
    </Link>
  );
}
