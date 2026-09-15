"use client";
import { useGSAP } from "@/lib/gsap";
import { useMuseumStore } from "@/stores/use-museum-store";

export default function useHeaderScroll(scope) {
  useGSAP(
    () => {
      const node = scope.current;
      let last = window.scrollY,
        travel = 0,
        direction = 0;
      const show = () => {
        node.dataset.headerHidden = "false";
      };
      const onScroll = () => {
        const current = window.scrollY;
        const delta = current - last;
        last = current;
        if (
          useMuseumStore.getState().isTransitionActive ||
          current < 80 ||
          node.contains(document.activeElement) ||
          node.querySelector("dialog[open]")
        ) {
          show();
          travel = 0;
          return;
        }
        const nextDirection = Math.sign(delta);
        if (nextDirection !== direction) travel = 0;
        direction = nextDirection;
        travel += delta;
        if (travel > 24) node.dataset.headerHidden = "true";
        else if (travel < -12) show();
      };
      const unsubscribe = useMuseumStore.subscribe((state) => {
        if (state.isTransitionActive) show();
      });
      window.addEventListener("scroll", onScroll, { passive: true });
      node.addEventListener("focusin", show);
      return () => {
        unsubscribe();
        window.removeEventListener("scroll", onScroll);
        node.removeEventListener("focusin", show);
      };
    },
    { scope },
  );
}
