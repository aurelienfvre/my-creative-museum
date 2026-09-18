"use server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "./auth";

export async function changeAccountEmail(form: FormData) {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });
  if (!session) return { error: "Votre session a expiré. Reconnectez-vous." };
  if (session.user.emailVerified)
    return {
      error:
        "Le changement d’une adresse vérifiée nécessite une confirmation par email.",
    };
  const email = String(form.get("email") || "").trim();
  const password = String(form.get("currentPassword") || "");
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.length > 254 ||
    !password ||
    password.length > 128
  ) {
    return {
      error: "Vérifiez votre adresse email et votre mot de passe actuel.",
    };
  }
  try {
    await auth.api.verifyPassword({
      body: { password },
      headers: requestHeaders,
    });
    await auth.api.changeEmail({
      body: { newEmail: email },
      headers: requestHeaders,
    });
    revalidatePath("/compte");
    return { success: "Votre adresse email a été modifiée." };
  } catch {
    return {
      error:
        "Modification impossible. Vérifiez votre mot de passe et utilisez une adresse disponible.",
    };
  }
}
