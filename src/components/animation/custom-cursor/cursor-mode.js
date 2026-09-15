import { gsap } from "@/lib/gsap";
export function updateCursorMode(cursor, next) {
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
