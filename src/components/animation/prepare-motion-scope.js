export function prepareMotionScope(root, pathname) {
  root.dataset.motionReady = "true";
  root.toggleAttribute(
    "data-restored",
    document.documentElement.dataset.restoredPage === pathname,
  );
}
