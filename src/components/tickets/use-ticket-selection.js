"use client";
import { useState } from "react";
import { getTicketSummary, quantity } from "@/lib/tickets.mjs";
export default function useTicketSelection() {
  const [counts, setCounts] = useState({});
  const [options, setOptions] = useState({});
  const summary = getTicketSummary(counts, options);
  function changeTicket(id, delta) {
    const current = counts[id] || 0;
    let next = quantity(current + delta);
    if (id === "group") {
      if (current === 0 && delta === 1) next = 11;
      if (current === 11 && delta === -1) next = 0;
    }
    const nextCounts = { ...counts, [id]: next };
    const { visitors } = getTicketSummary(nextCounts);
    setCounts(nextCounts);
    setOptions((previous) =>
      Object.fromEntries(
        Object.entries(previous).map(([key, value]) => [
          key,
          Math.min(value, visitors),
        ]),
      ),
    );
  }
  function changeOption(id, delta) {
    setOptions((previous) => ({
      ...previous,
      [id]: Math.min(summary.visitors, quantity((previous[id] || 0) + delta)),
    }));
  }
  function reset() {
    setCounts({});
    setOptions({});
  }
  return { counts, options, summary, changeTicket, changeOption, reset };
}
