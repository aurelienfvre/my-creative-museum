import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import * as schema from "../db/schema";
import { getAuthDatabase } from "./auth-database.mjs";
import { authSettings } from "./auth-settings";

export const authOptions = {
  ...authSettings,
  database: db
    ? drizzleAdapter(db, { provider: "pg", schema })
    : getAuthDatabase(),
};
