import { spawnSync } from "node:child_process";
import nextEnv from "@next/env";
import { getMigrations } from "better-auth/db/migration";

nextEnv.loadEnvConfig(process.cwd());
if (process.env.DATABASE_URL) {
  const result = spawnSync("npm", ["run", "db:migrate"], { stdio: "inherit" });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
} else {
  const { getAuthDatabase } = await import("../src/lib/auth-database.mjs");
  const settingsModule = await import("../src/lib/auth-settings.ts");
  const { authSettings } = settingsModule.default ?? settingsModule;
  const authOptions = { ...authSettings, database: getAuthDatabase() };
  try {
    const { runMigrations } = await getMigrations(authOptions);
    await runMigrations();
    console.log("Base SQLite locale prête.");
  } finally {
    authOptions.database.close();
  }
}
