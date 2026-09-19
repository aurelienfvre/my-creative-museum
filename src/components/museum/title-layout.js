import { gsap } from "@/lib/gsap";

// Keep the complete title box clear of the moving artworks, at every scale.
export function createTitleLayout(title, pictures, height) {
  const motion = { scale: 1, y: 0 };
  let titleHeight = 0,
    titleTop = 0,
    picturesTop = 0,
    gap = 20;
  const layout = {
    motion,
    measure() {
      titleHeight = title.offsetHeight;
      titleTop = title.offsetTop;
      picturesTop = pictures.offsetTop;
      gap = Math.max(20, height() * 0.035);
    },
    render() {
      const artworkTop = picturesTop + Number(gsap.getProperty(pictures, "y"));
      const ceiling = artworkTop - titleTop - titleHeight * motion.scale - gap;
      gsap.set(title, { scale: motion.scale, y: Math.min(motion.y, ceiling) });
    },
  };
  layout.measure();
  layout.render();
  return layout;
}
