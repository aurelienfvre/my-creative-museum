import { gsap } from "@/lib/gsap";
export function createCursorPhysics(cursor) {
  return () => {
    if (!cursor.visible || !cursor.point) return;
    const delta = Math.min(gsap.ticker.deltaRatio(60) / 60, 1 / 30);
    const damping = Math.exp(-20 * delta);
    for (const axis of ["x", "y"]) {
      cursor.velocity[axis] =
        (cursor.velocity[axis] +
          (cursor.targetPoint[axis] - cursor.position[axis]) * 190 * delta) *
        damping;
      cursor.position[axis] += cursor.velocity[axis] * delta;
    }
    const desired = gsap.utils.clamp(-9, 9, (cursor.velocity.x / 1200) * 9);
    cursor.tilt += (desired - cursor.tilt) * (1 - Math.exp(-14 * delta));
    const weight = cursor.follow.weight;
    gsap.set(cursor.motion, {
      x: (cursor.position.x - cursor.point.x) * weight,
      y: (cursor.position.y - cursor.point.y) * weight,
      rotation: cursor.tilt * weight,
    });
    if (cursor.mode !== "artwork" && weight === 0) {
      Object.assign(cursor.position, cursor.targetPoint);
      cursor.velocity.x = cursor.velocity.y = cursor.tilt = 0;
    }
  };
}
