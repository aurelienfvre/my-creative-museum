import { spawnSync } from "node:child_process";
import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL est obligatoire pour migrer la base PostgreSQL.",
  );
}
const result = spawnSync("npm", ["run", "db:migrate"], { stdio: "inherit" });
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
