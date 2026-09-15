"use client";
import FlipText from "@/components/animation/flip-text";
import Icon from "@/components/ui/icon";
import MuseumLogo from "@/components/ui/museum-logo";
import MenuBody from "./menu/menu-body";
import useMenu from "./menu/use-menu";

export default function Menu() {
  const { scope, dialog, opener, opened, pathname, open, close, select } =
    useMenu();
  return (
    <div ref={scope} className="menu-control">
      <button
        ref={opener}
        type="button"
        className="menu-toggle"
        aria-expanded={opened}
        aria-controls="museum-menu"
        onClick={open}
      >
        <FlipText>Menu</FlipText>
        <Icon name="menu" />
      </button>
      <dialog
        ref={dialog}
        id="museum-menu"
        className="museum-menu"
        aria-label="Navigation du musée"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
      >
        <div className="menu-top">
          <span className="brand">
            <MuseumLogo />
            <span className="brand-name">
              my creative
              <br />
              museum
            </span>
          </span>
          <button
            type="button"
            className="menu-toggle menu-close"
            onClick={() => close()}
          >
            <FlipText>Fermer</FlipText>
            <span className="menu-close-icon">
              <Icon name="close" />
            </span>
          </button>
        </div>
        <MenuBody pathname={pathname} select={select} />
      </dialog>
    </div>
  );
}
