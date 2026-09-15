import { gsap, useGSAP } from "@/lib/gsap";
import { bindCursorEvents } from "./cursor-events";
import { createCursorPhysics } from "./cursor-physics";
import { syncCursor } from "./sync-cursor";
export function useCustomCursor(ref) {
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        (_mediaContext, contextSafe) => {
          const element = ref.current;
          const cursor = {
            element,
            motion: element.querySelector(".cursor-badge-motion"),
            label: element.querySelector(".cursor-label"),
            position: { x: 0, y: 0 },
            targetPoint: { x: 0, y: 0 },
            velocity: { x: 0, y: 0 },
            follow: { weight: 0 },
            tilt: 0,
            visible: false,
            mode: "",
            activeDialog: null,
            point: null,
            setX: gsap.quickSetter(element, "x", "px"),
            setY: gsap.quickSetter(element, "y", "px"),
          };
          cursor.updateLabel = createCursorPhysics(cursor);
          const hide = () => {
            cursor.visible = false;
            cursor.element.style.opacity = "0";
            cursor.mode = "";
            gsap.ticker.remove(cursor.updateLabel);
            document.documentElement.classList.remove("has-custom-cursor");
          };
          const sync = contextSafe(() => syncCursor(cursor, hide));
          return bindCursorEvents(cursor, sync, hide);
        },
      );
      return () => media.revert();
    },
    { scope: ref },
  );
}
