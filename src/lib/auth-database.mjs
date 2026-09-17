import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import Database from "better-sqlite3";

export function getAuthDatabase() {
  if (process.env.VERCEL) {
    throw new Error(
      "Configurez DATABASE_URL avec une base PostgreSQL persistante sur Vercel. AUTH_DATABASE_PATH est réservé au développement local.",
    );
  }
  if (globalThis.museumAuthDatabase) return globalThis.museumAuthDatabase;
  const databasePath = resolve(
    /* turbopackIgnore: true */ process.env.AUTH_DATABASE_PATH ||
      "data/auth.sqlite",
  );
  mkdirSync(/* turbopackIgnore: true */ dirname(databasePath), {
    recursive: true,
  });
  const database = new Database(databasePath);
  database.pragma("journal_mode = WAL");
  database.pragma("foreign_keys = ON");
  globalThis.museumAuthDatabase = database;
  return database;
}
