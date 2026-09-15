import * as THREE from "three";

export function bindCarouselInteractions({
  canvas,
  camera,
  meshes,
  links,
  root,
  travel,
  works,
}) {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const hit = (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      (-(event.clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObjects(meshes, false)[0]?.object.userData.index;
  };
  const pointerMove = (event) => {
    if (hit(event) !== undefined) canvas.dataset.cursor = "artwork";
    else delete canvas.dataset.cursor;
  };
  const click = (event) => {
    const index = hit(event);
    if (index !== undefined)
      links[index].dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          ctrlKey: event.ctrlKey,
          metaKey: event.metaKey,
          shiftKey: event.shiftKey,
        }),
      );
  };
  const focus = (event) => {
    const index = links.indexOf(event.target.closest(".museum-carousel-card"));
    if (index < 0) return;
    const trigger = travel.scrollTrigger;
    trigger.scroll(
      trigger.start +
        (index / (works.length - 1)) * (trigger.end - trigger.start),
    );
  };
  canvas.addEventListener("pointermove", pointerMove);
  canvas.addEventListener("click", click);
  root.addEventListener("focusin", focus);

  return () => {
    canvas.removeEventListener("pointermove", pointerMove);
    canvas.removeEventListener("click", click);
    root.removeEventListener("focusin", focus);
    delete canvas.dataset.cursor;
  };
}
