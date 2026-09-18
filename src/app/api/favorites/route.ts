import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { favorites } from "@/lib/favorites";

export const runtime = "nodejs";
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  const options = { headers: { "Cache-Control": "private, no-store" } };
  if (!session)
    return Response.json(
      { error: "Connexion requise." },
      { ...options, status: 401 },
    );
  try {
    return Response.json(
      { slugs: await favorites.list(session.user.id) },
      options,
    );
  } catch {
    return Response.json(
      { error: "Favoris indisponibles." },
      { ...options, status: 503 },
    );
  }
}
