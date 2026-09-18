import { and, desc, eq } from "drizzle-orm";
import type { createDatabase } from "../../db";
import { favorite } from "../../db/schema";

export function postgresFavorites(db: ReturnType<typeof createDatabase>) {
  return {
    async list(userId: string) {
      const rows = await db
        .select({ slug: favorite.artworkSlug })
        .from(favorite)
        .where(eq(favorite.userId, userId))
        .orderBy(desc(favorite.createdAt), favorite.artworkSlug);
      return rows.map((row) => row.slug);
    },
    async set(userId: string, slug: string, saved: boolean) {
      if (saved)
        await db
          .insert(favorite)
          .values({ userId, artworkSlug: slug })
          .onConflictDoNothing();
      else
        await db
          .delete(favorite)
          .where(
            and(eq(favorite.userId, userId), eq(favorite.artworkSlug, slug)),
          );
    },
  };
}
