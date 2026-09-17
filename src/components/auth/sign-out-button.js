"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
export default function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const signOut = async () => {
    setPending(true);
    setError("");
    try {
      const result = await authClient.signOut();
      if (result.error) throw new Error("Sign out failed");
      router.replace("/connexion");
      router.refresh();
    } catch {
      setError("Impossible de vous déconnecter. Réessayez.");
      setPending(false);
    }
  };
  return (
    <div className="mt-10">
      <button
        type="button"
        disabled={pending}
        onClick={signOut}
        className="min-h-12 border border-foreground px-6 py-3 text-foreground transition-colors hover:bg-foreground hover:text-background"
      >
        {pending ? "Déconnexion…" : "Se déconnecter"}
      </button>
      {error && (
        <p role="alert" className="mt-4 text-sm text-red-800">
          {error}
        </p>
      )}
    </div>
  );
}
