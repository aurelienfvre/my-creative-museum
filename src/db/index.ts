import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export function createDatabase(connectionString: string) {
  let url: URL;
  try {
    url = new URL(connectionString);
  } catch {
    throw new Error(
      "DATABASE_URL invalide : copiez l’URL PostgreSQL complète depuis Neon dans .env.local (sans la commande psql).",
    );
  }
  if (
    !["postgres:", "postgresql:"].includes(url.protocol) ||
    !url.username ||
    !url.password ||
    !url.hostname ||
    !url.pathname ||
    url.pathname === "/"
  ) {
    throw new Error(
      "DATABASE_URL incomplète : elle doit contenir l’utilisateur, le mot de passe, l’hôte et le nom de la base. Copiez l’URL PostgreSQL complète depuis Neon. La valeur n’est pas affichée pour protéger vos identifiants.",
    );
  }
  return drizzle(neon(connectionString), { schema });
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    "DATABASE_URL est obligatoire : configurez votre base PostgreSQL Neon dans .env.local ou Vercel.",
  );
}
export const db = createDatabase(connectionString);
