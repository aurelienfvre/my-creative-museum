"use client";

import { useContext } from "react";
import FlipText from "@/components/animation/flip-text";
import Icon from "@/components/ui/icon";
import { NavigationContext } from "@/contexts/navigation-context";

export default function BackButton({ href }) {
  const navigate = useContext(NavigationContext);
  return (
    <button
      type="button"
      className="back-link"
      onClick={() => navigate(href, { back: true })}
    >
      <Icon name="arrowLeft" />
      <FlipText>Retour</FlipText>
    </button>
  );
}
