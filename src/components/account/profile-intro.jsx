"use client";
import { useRef, useState } from "react";
import FlipText from "@/components/animation/flip-text";
import SignOutButton from "@/components/auth/sign-out-button";
import { gsap, useGSAP } from "@/lib/gsap";

export default function ProfileIntro({ user, children }) {
  const scope = useRef(null);
  const [editing, setEditing] = useState(false);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-profile-detail]",
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.1,
            ease: "museum",
            clearProps: "transform",
          },
        );
      });
      return () => media.revert();
    },
    { scope },
  );
  return (
    <section ref={scope} aria-label="Mon profil" className="py-5 lg:py-8">
      <header className="flex max-w-3xl items-start gap-4 sm:gap-6 lg:items-center lg:gap-10">
        <div
          data-profile-detail
          aria-hidden="true"
          className="flex size-14 shrink-0 items-center justify-center overflow-hidden bg-foreground text-white sm:size-20 lg:size-32"
        >
          <span className="font-editorial text-[2.5rem] leading-none sm:text-[3.5rem] lg:text-[5.5rem]">
            {user.name.trim().slice(0, 1).toLocaleUpperCase("fr")}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div data-profile-detail>
            <h1 className="break-words text-[2rem] leading-[1.1] tracking-[-.045em] text-ink lg:text-[3rem]">
              {user.name}
            </h1>
            <p className="mt-2 break-all text-sm text-muted">{user.email}</p>
          </div>
          <div
            data-profile-detail
            className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 lg:mt-5 lg:gap-x-7"
          >
            <button
              type="button"
              aria-expanded={editing}
              aria-controls="profile-editor"
              onClick={() => setEditing(!editing)}
              className="text-link min-h-11 text-foreground"
            >
              <FlipText>{editing ? "Fermer" : "Modifier mon profil"}</FlipText>
            </button>
            <SignOutButton />
          </div>
        </div>
      </header>
      <div
        id="profile-editor"
        inert={!editing}
        aria-hidden={!editing}
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out motion-reduce:transition-none ${editing ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className="mt-6 max-w-2xl bg-foreground/[.035] px-4 py-2 sm:px-6 lg:mt-8 lg:ml-42 lg:px-8 lg:py-3">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
