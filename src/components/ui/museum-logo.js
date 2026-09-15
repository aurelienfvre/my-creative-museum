export default function MuseumLogo({
  className = "",
  size = 64,
  normalizeStrokes = true,
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
    >
      <g
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          className="logo-stroke"
          pathLength={normalizeStrokes ? 1 : undefined}
          d="M13 81 16 25Q18 15 25 24L48 56 73 20Q80 12 82 25L88 80"
        />
        <path
          className="logo-stroke"
          pathLength={normalizeStrokes ? 1 : undefined}
          d="m25 77 3-33 19 25q3 4 7-1l18-27 3 38"
        />
        <path
          className="logo-stroke"
          pathLength={normalizeStrokes ? 1 : undefined}
          d="M7 86q37-5 84 0M48 8l1 9m-8-5 15-1"
        />
      </g>
    </svg>
  );
}
