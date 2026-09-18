import { loadEnvConfig } from "@next/env";
import {
  account,
  favorite,
  rateLimit,
  session,
  user,
  verification,
} from "../src/db/schema";

async function verifyDatabase() {
  loadEnvConfig(process.cwd());
  const url = process.env.DATABASE_URL;
  if (!url)
    throw new Error(
      "DATABASE_URL manque : impossible de vérifier la base de l’application.",
    );
  // Load local environment before evaluating the database module.
  const { createDatabase } = await import("../src/db");
  const db = createDatabase(url);
  for (const [name, table] of Object.entries({
    user,
    session,
    account,
    favorite,
    verification,
    rateLimit,
  })) {
    try {
      // Validate every mapped column through the same connection as the app.
      // LIMIT 0 does not read any account or session data.
      await db.select().from(table).limit(0);
    } catch {
      throw new Error(
        `Table ${name} inaccessible ou incompatible sur DATABASE_URL. Vérifiez les migrations et que DATABASE_URL_UNPOOLED cible la même base et branche Neon.`,
      );
    }
  }
  console.log(
    "Schéma Better Auth vérifié sur la base utilisée par l’application.",
  );
}

verifyDatabase().catch((error: Error) => {
  console.error(error.message);
  process.exitCode = 1;
});
