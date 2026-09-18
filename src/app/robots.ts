import type { MetadataRoute } from "next";
import { metadataBase } from "@/lib/metadata";

export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV === "preview") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/compte", "/connexion", "/inscription"],
    },
    sitemap: new URL("/sitemap.xml", metadataBase).href,
  };
}
