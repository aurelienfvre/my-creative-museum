"use client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { getAuthErrorMessage } from "@/lib/auth-errors";
export default function useAuthForm(mode) {
  const router = useRouter();
  const lock = useRef(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const submit = async (event) => {
    event.preventDefault();
    if (lock.current) return;
    lock.current = true;
    setPending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const credentials = {
      email: form.get("email").trim(),
      password: form.get("password"),
    };
    try {
      const result =
        mode === "signup"
          ? await authClient.signUp.email({
              ...credentials,
              name: form.get("name").trim(),
            })
          : await authClient.signIn.email(credentials);
      if (result.error) {
        setError(getAuthErrorMessage(result.error, mode));
      } else {
        router.replace("/");
        router.refresh();
      }
    } catch {
      setError(getAuthErrorMessage({ status: 0 }, mode));
    } finally {
      lock.current = false;
      setPending(false);
    }
  };
  return { submit, pending, error };
}
