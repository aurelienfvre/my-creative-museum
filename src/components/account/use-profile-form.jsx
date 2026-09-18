"use client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { changeAccountEmail } from "@/lib/account-actions";
import { authClient } from "@/lib/auth-client";

const messages = {
  name: "Votre nom a été mis à jour.",
  email: "Votre adresse email a été mise à jour.",
  password: "Votre mot de passe a été mis à jour.",
};
export default function useProfileForm(kind) {
  const router = useRouter();
  const lock = useRef(false);
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState(null);
  async function submit(event) {
    event.preventDefault();
    if (lock.current) return;
    const element = event.currentTarget;
    const form = new FormData(element);
    if (
      kind === "password" &&
      form.get("newPassword") !== form.get("confirmPassword")
    ) {
      setFeedback({
        error: "Les deux nouveaux mots de passe doivent être identiques.",
      });
      return;
    }
    lock.current = true;
    setPending(true);
    setFeedback(null);
    try {
      const result =
        kind === "email"
          ? await changeAccountEmail(form)
          : kind === "name"
            ? await authClient.updateUser({
                name: String(form.get("name")).trim(),
              })
            : await authClient.changePassword({
                currentPassword: String(form.get("currentPassword")),
                newPassword: String(form.get("newPassword")),
                revokeOtherSessions: true,
              });
      if (result.error) {
        setFeedback({
          error:
            typeof result.error === "string"
              ? result.error
              : "Modification impossible. Vérifiez vos informations et réessayez.",
        });
        return;
      }
      for (const input of element.querySelectorAll("[data-password-field]"))
        input.value = "";
      setFeedback({ success: result.success || messages[kind] });
      await authClient.getSession({ query: { disableCookieCache: true } });
      router.refresh();
    } catch {
      setFeedback({
        error: "Connexion indisponible. Réessayez dans un instant.",
      });
    } finally {
      lock.current = false;
      setPending(false);
    }
  }
  return { submit, pending, feedback };
}
