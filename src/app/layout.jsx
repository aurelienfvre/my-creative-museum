import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { metadataBase, pageMetadata } from "@/lib/metadata";
import "lenis/dist/lenis.css";
import CustomCursor from "@/components/animation/custom-cursor";
import GSAPWrapper from "@/components/animation/gsap-wrapper";
import PageTransition from "@/components/animation/page-transition";
import SmoothScroll from "@/components/animation/smooth-scroll";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});
const editorial = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-museum-editorial",
  display: "swap",
});
export const metadata = {
  ...pageMetadata({ title: "Le goût de regarder autrement" }),
  metadataBase,
  title: {
    default: "My Creative Museum — Le goût de regarder autrement",
    template: "%s — My Creative Museum",
  },
  description:
    "Un musée numérique, libre et curieux. Explorez les œuvres, rencontrez les artistes et laissez-vous surprendre par l’art.",
};
export default function RootLayout({ children }) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} ${editorial.variable}`}
    >
      <body>
        <noscript>
          <style>{`.home-motion + .home-manifesto, .reveal-word > span, .manifesto-bottom { visibility: visible !important; opacity: 1 !important; }`}</style>
        </noscript>
        <a
          href="#main"
          className="skip-link fixed top-4 left-4 z-101 pointer-events-none opacity-0 [clip-path:inset(50%)] px-4 py-[.6rem] bg-foreground text-background focus-visible:opacity-100 focus-visible:pointer-events-auto focus-visible:[clip-path:none]"
        >
          Aller au contenu
        </a>
        <PageTransition navigation={<Header />}>
          <div className="page-surface relative z-2 bg-background shadow-[0_1rem_2rem_rgb(0_0_0/0.08)] pt-20 lg:pt-25 min-h-svh">
            <GSAPWrapper>{children}</GSAPWrapper>
          </div>
          <Footer />
        </PageTransition>
        <CustomCursor />
        <SmoothScroll />
      </body>
    </html>
  );
}
