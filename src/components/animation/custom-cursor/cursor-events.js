import { useMuseumStore } from "@/stores/use-museum-store";
export function bindCursorEvents(cursor, sync, hide) {
  const move = (event) => {
    if (event.pointerType !== "mouse") {
      hide();
      return;
    }
    cursor.point = { x: event.clientX, y: event.clientY };
    sync();
  };
  const leave = () => {
    cursor.point = null;
    hide();
  };
  const key = (event) => {
    if (event.key === "Tab") leave();
  };
  const visibility = () => {
    if (document.hidden) leave();
  };
  const unsubscribe = useMuseumStore.subscribe((state, previous) => {
    if (
      state.isFirstRender !== previous.isFirstRender ||
      state.isTransitionActive !== previous.isTransitionActive
    )
      sync();
  });
  document.addEventListener("pointermove", move, { passive: true });
  document.addEventListener("pointerover", move, { passive: true });
  document.addEventListener("pointerleave", leave);
  document.addEventListener("scroll", sync, {
    capture: true,
    passive: true,
  });
  document.addEventListener("keydown", key);
  document.addEventListener("visibilitychange", visibility);
  window.addEventListener("blur", leave);
  window.addEventListener("resize", sync);
  return () => {
    hide();
    unsubscribe();
    if (cursor.element.hidePopover && cursor.element.matches(":popover-open"))
      cursor.element.hidePopover();
    document.removeEventListener("pointermove", move);
    document.removeEventListener("pointerover", move);
    document.removeEventListener("pointerleave", leave);
    document.removeEventListener("scroll", sync, true);
    document.removeEventListener("keydown", key);
    document.removeEventListener("visibilitychange", visibility);
    window.removeEventListener("blur", leave);
    window.removeEventListener("resize", sync);
  };
}
