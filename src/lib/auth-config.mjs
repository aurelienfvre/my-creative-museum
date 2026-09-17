import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import Database from "better-sqlite3";

const databasePath = resolve(
  /* turbopackIgnore: true */ process.env.AUTH_DATABASE_PATH || "data/auth.sqlite",
);
// The database lives on the runtime filesystem, not in the application bundle.
mkdirSync(/* turbopackIgnore: true */ dirname(databasePath), {
  recursive: true,
});
const database = globalThis.museumAuthDatabase || new Database(databasePath);
database.pragma("journal_mode = WAL");
database.pragma("foreign_keys = ON");
if (process.env.NODE_ENV !== "production")
  globalThis.museumAuthDatabase = database;
export const authOptions = {
  appName: "My Creative Museum",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  rateLimit: { enabled: true, storage: "database" },
};
