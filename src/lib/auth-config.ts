import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import * as schema from "../db/schema";
import { authSettings } from "./auth-settings";

export const authOptions = {
  ...authSettings,
  database: drizzleAdapter(db, { provider: "pg", schema }),
};
