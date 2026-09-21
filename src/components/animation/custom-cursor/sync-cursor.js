import { gsap } from "@/lib/gsap";
import { useMuseumStore } from "@/stores/use-museum-store";
export function syncCursor(cursor, hide) {
  if (!cursor.point) {
    hide();
    return;
  }
  const museumState = useMuseumStore.getState();
  const covered = museumState.isFirstRender || museumState.isTransitionActive;
  // Do not let the badge's CSS fade linger over the fixed navigation.
  // Normal artwork hover transitions remain animated outside navigation.
  cursor.label.style.visibility = covered ? "hidden" : "";
  if (covered) {
    gsap.killTweensOf(cursor.follow);
    cursor.follow.weight = 0;
    cursor.velocity.x = cursor.velocity.y = cursor.tilt = 0;
    Object.assign(cursor.position, cursor.point);
    gsap.set(cursor.motion, { x: 0, y: 0, rotation: 0 });
  }
  const target = document.elementFromPoint(cursor.point.x, cursor.point.y);
  if (
    !target ||
    target.closest("input,textarea,select,[contenteditable=true]")
  ) {
    hide();
    return;
  }
  cursor.element.dataset.tone =
    covered ||
    target.closest(".museum-menu,.site-footer,.preloader,.page-transition")
      ? "light"
      : "dark";
  const dialog = target.closest("dialog");
  // Popover place le curseur au-dessus du top-layer des menus natifs.
  if (!cursor.visible || dialog !== cursor.activeDialog) {
    if (cursor.element.showPopover) {
      if (cursor.element.matches(":popover-open")) cursor.element.hidePopover();
      cursor.element.showPopover();
    } else if (dialog) {
      hide();
      return;
    }
    cursor.activeDialog = dialog;
  }
  const next = covered
    ? "default"
    : target.closest('[data-cursor="artwork"]')
      ? "artwork"
      : target.closest("a,button,summary,[role=button]")
        ? "link"
        : "default";
  updateCursorMode(cursor, next);
  if (!cursor.visible) {
    Object.assign(cursor.position, cursor.targetPoint);
    cursor.velocity.x = cursor.velocity.y = cursor.tilt = 0;
    gsap.set(cursor.motion, { x: 0, y: 0, rotation: 0 });
    gsap.ticker.add(cursor.updateLabel);
    gsap.set(cursor.element, { x: cursor.point.x, y: cursor.point.y });
    cursor.element.style.opacity = "1";
    document.documentElement.classList.add("has-custom-cursor");
    cursor.visible = true;
  }
  cursor.setX(cursor.point.x);
  cursor.setY(cursor.point.y);
}

function updateCursorMode(cursor, next) {
  const halfWidth = cursor.label.offsetWidth / 2;
  const halfHeight = cursor.label.offsetHeight / 2;
  cursor.targetPoint.x =
    next === "artwork"
      ? Math.max(
          halfWidth + 8,
          Math.min(cursor.point.x, innerWidth - halfWidth - 8),
        )
      : cursor.point.x;
  cursor.targetPoint.y =
    next === "artwork"
      ? Math.max(
          halfHeight + 8,
          Math.min(cursor.point.y, innerHeight - halfHeight - 8),
        )
      : cursor.point.y;
  if (next !== cursor.mode) {
    cursor.mode = next;
    cursor.element.dataset.mode = cursor.mode;
    gsap.to(cursor.follow, {
      weight: cursor.mode === "artwork" ? 1 : 0,
      duration: cursor.mode === "artwork" ? 0.35 : 0.65,
      ease: "power2.inOut",
      overwrite: true,
    });
  }
}
