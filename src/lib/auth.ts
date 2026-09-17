import "server-only";
import { betterAuth } from "better-auth";
import { authOptions } from "./auth-config";
export const auth = betterAuth(authOptions);
