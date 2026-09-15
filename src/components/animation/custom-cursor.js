"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMuseumStore } from "@/stores/use-museum-store";

export default function CustomCursor() {
  const cursor = useRef(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        (_mediaContext, contextSafe) => {
          const element = cursor.current;
          const motion = element.querySelector(".cursor-badge-motion");
          const label = element.querySelector(".cursor-label");
          // Une seule position porte le badge et la croix, y compris pendant le retour.
          const position = { x: 0, y: 0 };
          const targetPoint = { x: 0, y: 0 };
          const velocity = { x: 0, y: 0 };
          const follow = { weight: 0 };
          let tilt = 0;
          const updateLabel = () => {
            if (!visible || !point) return;
            const delta = Math.min(gsap.ticker.deltaRatio(60) / 60, 1 / 30);
            const damping = Math.exp(-20 * delta);
            for (const axis of ["x", "y"]) {
              velocity[axis] =
                (velocity[axis] +
                  (targetPoint[axis] - position[axis]) * 190 * delta) *
                damping;
              position[axis] += velocity[axis] * delta;
            }
            const desired = gsap.utils.clamp(-9, 9, (velocity.x / 1200) * 9);
            tilt += (desired - tilt) * (1 - Math.exp(-14 * delta));
            const weight = follow.weight;
            gsap.set(motion, {
              x: (position.x - point.x) * weight,
              y: (position.y - point.y) * weight,
              rotation: tilt * weight,
            });
            if (mode !== "artwork" && weight === 0) {
              Object.assign(position, targetPoint);
              velocity.x = velocity.y = tilt = 0;
            }
          };
          // La croix suit le pointeur sans inertie ; seul le badge garde son ressort.
          const setX = gsap.quickSetter(element, "x", "px");
          const setY = gsap.quickSetter(element, "y", "px");
          let visible = false,
            mode = "",
            activeDialog = null,
            point = null;
          const hide = () => {
            visible = false;
            element.style.opacity = "0";
            mode = "";
            gsap.ticker.remove(updateLabel);
            document.documentElement.classList.remove("has-custom-cursor");
          };
          const sync = contextSafe(() => {
            if (!point) {
              hide();
              return;
            }
            const state = useMuseumStore.getState();
            const covered = state.isFirstRender || state.isTransitionActive;
            // Do not let the badge's CSS fade linger over the fixed navigation.
            // Normal artwork hover transitions remain animated outside navigation.
            label.style.visibility = covered ? "hidden" : "";
            if (covered) {
              gsap.killTweensOf(follow);
              follow.weight = 0;
              velocity.x = velocity.y = tilt = 0;
              Object.assign(position, point);
              gsap.set(motion, { x: 0, y: 0, rotation: 0 });
            }
            const target = document.elementFromPoint(point.x, point.y);
            if (
              !target ||
              target.closest("input,textarea,select,[contenteditable=true]")
            ) {
              hide();
              return;
            }
            element.dataset.tone =
              covered ||
              target.closest(
                ".museum-menu,.site-footer,.preloader,.page-transition",
              )
                ? "light"
                : "dark";
            const dialog = target.closest("dialog");
            // Popover place le curseur au-dessus du top-layer des menus natifs.
            if (!visible || dialog !== activeDialog) {
              if (element.showPopover) {
                if (element.matches(":popover-open")) element.hidePopover();
                element.showPopover();
              } else if (dialog) {
                hide();
                return;
              }
              activeDialog = dialog;
            }
            const next = covered
              ? "default"
              : target.closest('[data-cursor="artwork"]')
                ? "artwork"
                : target.closest("a,button,summary,[role=button]")
                  ? "link"
                  : "default";
            const halfWidth = label.offsetWidth / 2;
            const halfHeight = label.offsetHeight / 2;
            targetPoint.x =
              next === "artwork"
                ? Math.max(
                    halfWidth + 8,
                    Math.min(point.x, innerWidth - halfWidth - 8),
                  )
                : point.x;
            targetPoint.y =
              next === "artwork"
                ? Math.max(
                    halfHeight + 8,
                    Math.min(point.y, innerHeight - halfHeight - 8),
                  )
                : point.y;
            if (next !== mode) {
              mode = next;
              element.dataset.mode = mode;
              gsap.to(follow, {
                weight: mode === "artwork" ? 1 : 0,
                duration: mode === "artwork" ? 0.35 : 0.65,
                ease: "power2.inOut",
                overwrite: true,
              });
            }
            if (!visible) {
              Object.assign(position, targetPoint);
              velocity.x = velocity.y = tilt = 0;
              gsap.set(motion, { x: 0, y: 0, rotation: 0 });
              gsap.ticker.add(updateLabel);
              gsap.set(element, { x: point.x, y: point.y });
              element.style.opacity = "1";
              document.documentElement.classList.add("has-custom-cursor");
              visible = true;
            }
            setX(point.x);
            setY(point.y);
          });
          const move = (event) => {
            if (event.pointerType !== "mouse") {
              hide();
              return;
            }
            point = { x: event.clientX, y: event.clientY };
            sync();
          };
          const leave = () => {
            point = null;
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
            if (element.hidePopover && element.matches(":popover-open"))
              element.hidePopover();
            document.removeEventListener("pointermove", move);
            document.removeEventListener("pointerover", move);
            document.removeEventListener("pointerleave", leave);
            document.removeEventListener("scroll", sync, true);
            document.removeEventListener("keydown", key);
            document.removeEventListener("visibilitychange", visibility);
            window.removeEventListener("blur", leave);
            window.removeEventListener("resize", sync);
          };
        },
      );
      return () => media.revert();
    },
    { scope: cursor },
  );
  return (
    <div
      className="custom-cursor"
      popover="manual"
      ref={cursor}
      aria-hidden="true"
    >
      <div className="cursor-badge-motion">
        <div className="cursor-cross">
          <svg
            aria-hidden="true"
            viewBox="0 0 28 28"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          >
            <path d="M14 1v26M1 14h26" />
          </svg>
        </div>
        <div className="cursor-label">
          <span>Voir l’œuvre</span>
        </div>
      </div>
    </div>
  );
}
