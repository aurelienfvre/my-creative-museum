export function createSnapshot(content) {
  // Freeze the viewport before transforming its parent: fixed pins and sticky
  // museum stages otherwise move when cloned into an unscrolled container.
  // Keep a non-interactive copy of the outgoing viewport while Next commits.
  // The incoming page itself then slides above it, with no colored curtain.
  const snapshot = content.cloneNode(true);
  // cloneNode copies canvas markup, not its pixels. Capture the already-rendered
  // WebGL frame once; the rail retains its drawing buffer for this handoff.
  const sourceCanvases = content.querySelectorAll("canvas");
  const copiedCanvases = snapshot.querySelectorAll("canvas");
  sourceCanvases.forEach((source, index) => {
    const copy = copiedCanvases[index];
    if (!copy || !source.width || !source.height) return;
    copy.width = source.width;
    copy.height = source.height;
    copy.getContext("2d")?.drawImage(source, 0, 0);
  });
  // Preserve SVG masks/gradients without introducing duplicate document IDs.
  const ids = new Map();
  snapshot.querySelectorAll("[id]").forEach((node, index) => {
    const previous = node.id;
    const next = `outgoing-${index}-${previous}`;
    ids.set(previous, next);
    node.id = next;
  });
  snapshot.querySelectorAll("*").forEach((node) => {
    for (const attribute of [...node.attributes]) {
      let value = attribute.value;
      for (const [previous, next] of ids) {
        value = value.replaceAll(`url(#${previous})`, `url(#${next})`);
        if (value === `#${previous}`) value = `#${next}`;
      }
      if (value !== attribute.value) node.setAttribute(attribute.name, value);
    }
  });
  snapshot.querySelectorAll("script,dialog,.custom-cursor").forEach((node) => {
    node.remove();
  });
  const stages =
    ".pin-spacer > section, [data-full-frame], [data-artists-stage], [data-passage-stage]";
  const pinned = content.querySelectorAll(stages);
  const clonedPins = snapshot.querySelectorAll(stages);
  pinned.forEach((node, index) => {
    const position = getComputedStyle(node).position;
    if (position !== "fixed" && position !== "sticky") return;
    const rect = node.getBoundingClientRect();
    const clone = clonedPins[index];
    if (!clone) return;
    // The translated snapshot becomes the fixed containing block. Preserve the
    // live viewport position, including stages already partly leaving the view.
    Object.assign(clone.style, {
      position: "fixed",
      top: `${rect.top + window.scrollY}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      transform: "none",
      bottom: "auto",
      right: "auto",
    });
  });
  snapshot.inert = true;
  snapshot.style.transform = `translateY(${-window.scrollY}px)`;

  return snapshot;
}
