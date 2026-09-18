export default function Skeleton({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`bg-foreground/[.07] motion-safe:animate-pulse ${className}`}
    />
  );
}
