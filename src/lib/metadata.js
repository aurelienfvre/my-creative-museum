export const siteName = "My Creative Museum";
export const siteDescription =
  "Un musée numérique, libre et curieux. Explorez les œuvres, rencontrez les artistes et laissez-vous surprendre par l’art.";
const origin =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
export const metadataBase = new URL(origin);
const image = {
  url: "/social/opengraph.png",
  width: 1200,
  height: 630,
  alt: "Logo de My Creative Museum",
};
export function pageMetadata({ title, description = siteDescription, path }) {
  const socialTitle = title === siteName ? title : `${title} — ${siteName}`;
  return {
    title,
    description,
    ...(path ? { alternates: { canonical: path } } : {}),
    openGraph: {
      type: "website",
      locale: "fr_FR",
      siteName,
      title: socialTitle,
      description,
      images: [image],
      ...(path ? { url: path } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [image],
    },
  };
}
