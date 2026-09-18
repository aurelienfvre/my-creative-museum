import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export function createDatabase(connectionString: string) {
  return drizzle(neon(connectionString), { schema });
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    "DATABASE_URL est obligatoire : configurez votre base PostgreSQL Neon dans .env.local ou Vercel.",
  );
}
export const db = createDatabase(connectionString);
