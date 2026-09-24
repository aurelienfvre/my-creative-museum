"use client";
import { useRef, useState } from "react";

export default function useSearchCatalog() {
  const [objects, setObjects] = useState([]);
  const [status, setStatus] = useState("idle");
  const loading = useRef(false);
  const loaded = useRef(false);

  async function load() {
    if (loading.current || loaded.current) return;
    loading.current = true;
    setStatus("loading");
    try {
      const response = await fetch("/api/search", {
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) throw new Error("Search unavailable");
      const data = await response.json();
      if (!Array.isArray(data.objects)) throw new Error("Invalid catalog");
      setObjects(data.objects);
      loaded.current = true;
      setStatus("ready");
    } catch {
      setStatus("error");
    } finally {
      loading.current = false;
    }
  }

  return { objects, status, load };
}
