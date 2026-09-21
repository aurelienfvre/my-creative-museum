// Notify immediately, then confirm or restore the previous state.
export async function updateFavoriteOptimistically(previous, persist, notify) {
  const next = !previous;
  notify(next, { pending: true });
  try {
    const result = await persist(next);
    if (result.error) {
      notify(previous, { pending: false, error: result.error });
      return;
    }
    notify(result.saved, { pending: false });
  } catch {
    notify(previous, {
      pending: false,
      error: "Impossible d’enregistrer ce changement. Réessayez.",
    });
  }
}
