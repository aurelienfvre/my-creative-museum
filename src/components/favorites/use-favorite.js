"use client";
import { useEffect, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { setFavorite } from "@/lib/favorites/actions";
import { updateFavoriteOptimistically } from "@/lib/favorites/optimistic.mjs";

export default function useFavorite(slug, initialSaved, onChange) {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const [saved, setSaved] = useState(initialSaved ?? false);
  const [loading, setLoading] = useState(initialSaved === undefined);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const lock = useRef(false);
  const userId = session?.user.id;
  useEffect(() => {
    if (!userId || initialSaved !== undefined) {
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setError("");
    fetch("/api/favorites", { signal: controller.signal, cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then(({ slugs }) => {
        setSaved(slugs.includes(slug));
        setLoading(false);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setError("Favoris indisponibles. Rechargez la page.");
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [userId, slug, initialSaved]);
  async function toggle() {
    if (lock.current || loading || !userId) return;
    lock.current = true;
    setPending(true);
    setError("");
    try {
      await updateFavoriteOptimistically(
        saved,
        (next) => setFavorite(slug, next),
        (next, feedback) => {
          setSaved(next);
          setError(feedback.error || "");
          onChange?.(next, feedback);
        },
      );
    } finally {
      lock.current = false;
      setPending(false);
    }
  }
  return {
    saved,
    loading: !hydrated || loading || sessionPending,
    pending,
    error,
    session,
    toggle,
  };
}
