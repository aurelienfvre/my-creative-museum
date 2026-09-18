import type { MetadataRoute } from "next";
import { metadataBase } from "@/lib/metadata";
import { getObjects } from "@/lib/museum";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const objects = await getObjects();
  const pages: MetadataRoute.Sitemap = [
    {
      url: new URL("/", metadataBase).href,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: new URL("/collection", metadataBase).href,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: new URL("/musee", metadataBase).href,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: new URL("/billetterie", metadataBase).href,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
  const slugs = new Set<string>(
    objects.map((object: { slug: string }) => object.slug).filter(Boolean),
  );
  return [
    ...pages,
    ...[...slugs].map((slug) => ({
      url: new URL(`/oeuvres/${encodeURIComponent(slug)}`, metadataBase).href,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
