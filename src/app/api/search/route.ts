import { getObjects } from "@/lib/museum";

export async function GET() {
  try {
    const objects = (await getObjects()).map(
      ({ id, slug, title, artist, image, movement, year, color }) => ({
        id,
        slug,
        title,
        artist,
        image,
        movement,
        year,
        color,
      }),
    );
    return Response.json(
      { objects },
      { headers: { "Cache-Control": "public, max-age=300" } },
    );
  } catch {
    return Response.json(
      { error: "La recherche est momentanément indisponible." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
