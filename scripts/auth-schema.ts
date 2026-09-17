import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/neon-http";
import { authSettings } from "../src/lib/auth-settings";

// Schema generation is offline: this mock never connects to Neon.
export const auth = betterAuth({
  ...authSettings,
  database: drizzleAdapter(drizzle.mock(), { provider: "pg" }),
});
