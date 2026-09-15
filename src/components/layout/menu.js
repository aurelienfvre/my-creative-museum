"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useRef, useState } from "react";
import FlipText from "@/components/animation/flip-text";
import { NavigationContext } from "@/components/animation/page-transition";
import Icon from "@/components/ui/icon";
import MuseumLogo from "@/components/ui/museum-logo";
import { gsap, useGSAP } from "@/lib/gsap";

const links = [
  { href: "/", label: "L’accueil" },
  { href: "/collection", label: "La collection" },
  { href: "/musee", label: "Le musée" },
  { href: "/billetterie", label: "La billetterie" },
];
export default function Menu() {
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
    gsap
      .timeline({
        onComplete: () => {
          busy.current = false;
        },
      })
      .fromTo(
        dialog.current,
        { xPercent: 105 },
        { xPercent: 0, duration: reduced() ? 0 : 0.8, ease: "curtain" },
      )
      .fromTo(
        ".menu-link-word",
        { yPercent: 115, rotation: 5 },
        {
          yPercent: 0,
          rotation: 0,
          stagger: reduced() ? 0 : 0.075,
          duration: reduced() ? 0 : 0.75,
          ease: "museum",
        },
        reduced() ? 0 : 0.3,
      )
      .fromTo(
        ".menu-aside",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: reduced() ? 0 : 0.5 },
        reduced() ? 0 : 0.5,
      );
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
  return (
    <div ref={scope} className="menu-control">
      <button
        ref={opener}
        type="button"
        className="menu-toggle"
        aria-expanded={opened}
        aria-controls="museum-menu"
        onClick={open}
      >
        <FlipText>Menu</FlipText>
        <Icon name="menu" />
      </button>
      <dialog
        ref={dialog}
        id="museum-menu"
        className="museum-menu"
        aria-label="Navigation du musée"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
      >
        <div className="menu-top">
          <span className="brand">
            <MuseumLogo />
            <span className="brand-name">
              my creative
              <br />
              museum
            </span>
          </span>
          <button
            type="button"
            className="menu-toggle menu-close"
            onClick={() => close()}
          >
            <FlipText>Fermer</FlipText>
            <span className="menu-close-icon">
              <Icon name="close" />
            </span>
          </button>
        </div>
        <div className="menu-body">
          <div className="menu-aside">
            <span className="eyebrow">La curiosité vous va si bien.</span>
            <MuseumLogo size={190} />
            <p>
              Entrez.
              <br />
              <em>Regardez autrement.</em>
            </p>
          </div>
          <nav aria-label="Navigation principale">
            {links.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(event) => select(event, link.href)}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                <span className="menu-number">0{index + 1}</span>
                <span className="menu-link-mask">
                  <span className="menu-link-word">
                    <FlipText>{link.label}</FlipText>
                  </span>
                </span>
                <Icon />
              </Link>
            ))}
          </nav>
        </div>
      </dialog>
    </div>
  );
}
