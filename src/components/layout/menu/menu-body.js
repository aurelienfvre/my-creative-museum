import Link from "next/link";
import FlipText from "@/components/animation/flip-text";
import Icon from "@/components/ui/icon";
import MuseumLogo from "@/components/ui/museum-logo";

const links = [
  { href: "/", label: "L’accueil" },
  { href: "/collection", label: "La collection" },
  { href: "/musee", label: "Le musée" },
  { href: "/billetterie", label: "La billetterie" },
];

export default function MenuBody({ pathname, select }) {
  return (
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
  );
}
