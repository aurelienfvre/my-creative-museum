const sprite = [
  "000001111110",
  "000001101110",
  "000001111110",
  "000001110000",
  "100011111000",
  "110111110000",
  "111111110000",
  "011111100000",
  "001111000000",
  "001001000000",
];

export function drawDino(ctx, run, active) {
  ctx.clearRect(0, 0, 840, 250);
  ctx.fillStyle = "#243bba";
  ctx.fillRect(0, 206, 840, 1);
  for (let x = 0; x < 900; x += 64)
    ctx.fillRect(x - ((run.distance * 0.5) % 64), 219 + (x % 3) * 5, 8, 1);
  sprite.forEach((row, y) => {
    [...row].forEach((pixel, x) => {
      if (pixel === "1") ctx.fillRect(76 + x * 4, 160 - run.y + y * 4, 4, 4);
    });
  });
  const stride =
    active && run.y === 0 ? (Math.floor(run.distance / 24) % 2) * 4 : 0;
  ctx.fillRect(84, 200 - run.y, 4, 6 - stride);
  ctx.fillRect(96, 200 - run.y, 4, 2 + stride);
  for (const item of run.obstacles) {
    ctx.fillRect(item.x + item.w * 0.4, 206 - item.h, item.w * 0.25, item.h);
    ctx.fillRect(item.x, 212 - item.h, 5, item.h * 0.5);
    ctx.fillRect(item.x, 206 - item.h * 0.4, item.w * 0.6, 5);
    ctx.fillRect(item.x + item.w * 0.65, 206 - item.h * 0.65, item.w * 0.35, 5);
    ctx.fillRect(item.x + item.w - 5, 206 - item.h * 0.8, 5, item.h * 0.2);
  }
}
