export function createRun() {
  return {
    y: 0,
    vy: 0,
    distance: 0,
    score: 0,
    spawn: 1.4,
    obstacles: [],
    over: false,
  };
}
export function jump(run) {
  if (run.y === 0 && !run.over) run.vy = 570;
}
export function advance(run, dt, random = Math.random) {
  if (run.over) return;
  const speed = Math.min(420, 230 + run.distance / 110);
  run.distance += speed * dt;
  run.score = Math.floor(run.distance / 12);
  run.y = Math.max(0, run.y + run.vy * dt);
  run.vy -= 1600 * dt;
  if (run.y === 0 && run.vy < 0) run.vy = 0;
  run.spawn -= dt;
  if (run.spawn <= 0) {
    run.obstacles.push({
      x: 840,
      w: 22 + random() * 12,
      h: 32 + random() * 18,
    });
    run.spawn = 1.3 + random() * 0.7;
  }
  for (const obstacle of run.obstacles) {
    obstacle.x -= speed * dt;
    if (
      obstacle.x < 113 &&
      obstacle.x + obstacle.w > 85 &&
      run.y < obstacle.h - 6
    )
      run.over = true;
  }
  run.obstacles = run.obstacles.filter(
    (obstacle) => obstacle.x + obstacle.w > 0,
  );
}
