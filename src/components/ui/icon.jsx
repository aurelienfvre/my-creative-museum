const paths = {
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Zm13 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
  eyeOff:
    "m3 3 18 18M10 5.2a11 11 0 0 1 2-.2c6.5 0 10 7 10 7a20 20 0 0 1-3 4M6.5 6.5A23 23 0 0 0 2 12s3.5 7 10 7a12 12 0 0 0 5.5-1.5M10 10a3 3 0 0 0 4 4",
  user: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0M4 21v-2a8 8 0 0 1 16 0v2",
  arrowUpRight: "M5 19 19 5M5 5h14v14",
  arrowRight: "M4 12h16m-7-7 7 7-7 7",
  arrowLeft: "M20 12H4m7-7-7 7 7 7",
  arrowDown: "M12 4v16m-7-7 7 7 7-7",
  close: "m6 6 12 12M6 18 18 6",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  menu: "M5 7h17M2 17h17",
  search: "M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14m5 12 6 6",
};
export default function Icon({
  name = "arrowUpRight",
  className = "",
  ...props
}) {
  return (
    <svg
      className={`icon ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {name === "menu" ? (
        <>
          <path
            className="menu-line-top transition-transform duration-450 ease-[cubic-bezier(.22,1,.36,1)] group-hover/menu:-translate-x-[3px] group-focus-visible/menu:-translate-x-[3px]"
            d="M5 7h17"
          />
          <path
            className="menu-line-bottom transition-transform duration-450 ease-[cubic-bezier(.22,1,.36,1)] group-hover/menu:translate-x-[3px] group-focus-visible/menu:translate-x-[3px]"
            d="M2 17h17"
          />
        </>
      ) : (
        <path d={paths[name] || paths.arrowUpRight} />
      )}
    </svg>
  );
}
