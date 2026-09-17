import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export function createDatabase(connectionString: string) {
  return drizzle(neon(connectionString), { schema });
}

// SQLite remains available locally until a Neon development branch is connected.
export const db = process.env.DATABASE_URL
  ? createDatabase(process.env.DATABASE_URL)
  : null;
