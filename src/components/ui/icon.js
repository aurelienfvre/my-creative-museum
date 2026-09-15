const paths = {
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
          <path className="menu-line-top" d="M5 7h17" />
          <path className="menu-line-bottom" d="M2 17h17" />
        </>
      ) : (
        <path d={paths[name] || paths.arrowUpRight} />
      )}
    </svg>
  );
}
