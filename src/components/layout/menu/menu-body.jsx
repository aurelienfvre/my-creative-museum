import Link from "next/link";
import FlipText from "@/components/animation/flip-text";
import MuseumLogo from "@/components/ui/museum-logo";

const links = [
  { href: "/", label: "L’accueil" },
  { href: "/collection", label: "La collection" },
  { href: "/musee", label: "Le musée" },
  { href: "/billetterie", label: "La billetterie" },
];

export default function MenuBody({ pathname, select }) {
  return (
    <div className="menu-body grid flex-1 grid-cols-1 items-center gap-8 py-8 lg:grid-cols-[1fr_1.7fr] lg:gap-12 lg:py-12">
      <div className="menu-aside hidden lg:block [&>svg]:my-8 [&>svg]:size-32 [&>svg]:rotate-[-10deg]">
        <MuseumLogo size={190} />
        <p className="text-[1.3rem]">
          Entrez.
          <br />
          <em className="font-editorial text-[2rem]">Regardez autrement.</em>
        </p>
      </div>
      <nav className="flex flex-col" aria-label="Navigation principale">
        {links.map((link, index) => (
          <Link
            className="flex items-center gap-[0.8rem] border-b border-background/20 py-4 aria-[current=page]:text-accent lg:gap-6 lg:py-[0.65rem] [&>.icon]:ml-auto [&>.icon]:size-[1.3rem] lg:[&>.icon]:size-[1.8rem]"
            key={link.href}
            href={link.href}
            onClick={(event) => select(event, link.href)}
            aria-current={pathname === link.href ? "page" : undefined}
          >
            <span className="menu-number self-center font-mono text-[0.6rem] opacity-60 lg:text-[0.65rem]">
              0{index + 1}
            </span>
            <span className="menu-link-mask -my-[0.08em] block overflow-hidden py-[0.08em]">
              <span className="menu-link-word block text-[2.7rem] font-normal leading-[1.1] tracking-[-0.055em] lg:text-[4.5rem]">
                <FlipText>{link.label}</FlipText>
              </span>
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
