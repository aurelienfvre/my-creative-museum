import nextEnv from "@next/env";
import { getMigrations } from "better-auth/db/migration";

nextEnv.loadEnvConfig(process.cwd());
const { authOptions } = await import("../src/lib/auth-config.mjs");
const { runMigrations } = await getMigrations(authOptions);
await runMigrations();
authOptions.database.close();
console.log("Base Better Auth prête.");
