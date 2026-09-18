"use server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "../auth";
import { getObject } from "../museum";
import { favorites } from "./index";

export async function setFavorite(slug: string, saved: boolean) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return {
      error: "Connectez-vous pour garder cette œuvre.",
      unauthorized: true,
    };
  if (
    typeof slug !== "string" ||
    !/^[a-z0-9-]{1,200}$/.test(slug) ||
    typeof saved !== "boolean"
  ) {
    return { error: "Œuvre invalide." };
  }
  try {
    if (saved && !(await getObject(slug)))
      return { error: "Cette œuvre est introuvable." };
    await favorites.set(session.user.id, slug, saved);
    revalidatePath("/compte");
    return { saved };
  } catch {
    return { error: "Impossible de modifier vos favoris. Réessayez." };
  }
}
