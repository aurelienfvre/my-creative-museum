import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { metadataBase, pageMetadata } from "@/lib/metadata";
import "lenis/dist/lenis.css";
import CustomCursor from "@/components/animation/custom-cursor";
import GSAPWrapper from "@/components/animation/gsap-wrapper";
import PageTransition from "@/components/animation/page-transition";
import SmoothScroll from "@/components/animation/smooth-scroll";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { getObjects, publicObject } from "@/lib/museum";
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
export default async function RootLayout({ children }) {
  const objects = await getObjects().catch(() => []);
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} ${editorial.variable}`}
    >
      <body>
        <noscript>
          <style>{`.home-motion + .home-manifesto { visibility: visible !important; }`}</style>
        </noscript>
        <a href="#main" className="skip-link">
          Aller au contenu
        </a>
        <PageTransition
          navigation={<Header objects={objects.map(publicObject)} />}
        >
          <div className="page-surface">
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
