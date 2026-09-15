import { cache } from "react";
import sanitizeHtml from "sanitize-html";

const API = "https://api-museum.vercel.app";

export function imageUrl(value) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return null;
    // Wikimedia n’accepte plus les tailles arbitraires présentes dans l’API.
    if (
      url.hostname === "upload.wikimedia.org" &&
      url.pathname.includes("/thumb/")
    ) {
      url.pathname = url.pathname.replace(/\/\d+px-([^/]+)$/, "/1280px-$1");
    }
    return url.toString();
  } catch {
    return null;
  }
}

function normalize(object) {
  return {
    ...object,
    image: imageUrl(object.image),
    gallery: [...new Set((object.gallery || []).map(imageUrl).filter(Boolean))],
    description: sanitizeHtml(object.description || "", {
      allowedTags: ["p", "strong", "em", "i", "b", "br", "ul", "ol", "li"],
      allowedAttributes: {},
    }),
  };
}

export const getObjects = cache(async () => {
  const response = await fetch(`${API}/objects`, {
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok)
    throw new Error("La collection est momentanément indisponible.");
  const data = await response.json();
  if (!Array.isArray(data.objects))
    throw new Error("Format de collection invalide.");
  let objects = data.objects;
  for (let page = 2; page <= (data.totalPages || 1); page++) {
    const next = await fetch(`${API}/objects?page=${page}`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(10000),
    });
    if (!next.ok)
      throw new Error("La suite de la collection est indisponible.");
    const result = await next.json();
    objects = objects.concat(result.objects);
  }
  return [
    ...new Map(objects.map((item) => [item.id, normalize(item)])).values(),
  ];
});

export const getObject = cache(async (slug) => {
  const response = await fetch(`${API}/objects/${encodeURIComponent(slug)}`, {
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(10000),
  });
  if (response.status === 404) return null;
  if (!response.ok)
    throw new Error("Cette œuvre est momentanément indisponible.");
  return normalize(await response.json());
});

export function publicObject({ description, gallery, ...object }) {
  return object;
}
