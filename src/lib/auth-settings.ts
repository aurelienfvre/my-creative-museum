import type { BetterAuthOptions } from "better-auth";
import { nextCookies } from "better-auth/next-js";

export const authSettings = {
  appName: "My Creative Museum",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  user: {
    changeEmail: { enabled: true, updateEmailWithoutVerification: true },
  },
  rateLimit: { enabled: true, storage: "database" },
  plugins: [nextCookies()],
} satisfies BetterAuthOptions;
