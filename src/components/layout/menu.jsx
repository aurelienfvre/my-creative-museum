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
    <div ref={scope} className="menu-control flex items-center">
      <button
        ref={opener}
        type="button"
        className="menu-toggle group/menu inline-flex items-center gap-[0.9rem] whitespace-nowrap border-0 bg-transparent py-[0.7rem] pl-[0.6rem] text-[0.75rem] font-medium uppercase tracking-[0.06em] lg:gap-[0.85rem] lg:text-[0.82rem] [&>.icon]:h-[1.2rem] [&>.icon]:w-[1.5rem] [&>.icon]:stroke-[1.2] lg:[&>.icon]:h-[1.3rem] lg:[&>.icon]:w-[1.65rem]"
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
        className="museum-menu [&_:focus-visible]:outline-accent fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain border-0 bg-foreground px-5 py-0 text-background open:flex open:flex-col backdrop:bg-[rgb(23_27_46/0.2)] lg:px-14"
        aria-label="Navigation du musée"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
      >
        <div className="menu-top flex items-center justify-between border-b border-background/25 py-[1.2rem] lg:py-6">
          <span className="brand flex items-center gap-[0.7rem] [&>svg]:size-[2.7rem] lg:[&>svg]:size-[3.3rem] text-inherit">
            <MuseumLogo />
            <span className="brand-name text-[0.72rem] font-semibold leading-[1.08] tracking-[-0.04em] lg:text-[0.9rem]">
              my creative
              <br />
              museum
            </span>
          </span>
          <button
            type="button"
            className="menu-toggle group/menu menu-close inline-flex items-center gap-[0.9rem] whitespace-nowrap border-0 bg-transparent py-[0.7rem] pl-[0.6rem] text-[0.75rem] font-medium uppercase tracking-[0.06em] lg:gap-[0.85rem] lg:text-[0.82rem] [&>.icon]:h-[1.2rem] [&>.icon]:w-[1.5rem] [&>.icon]:stroke-[1.2] lg:[&>.icon]:h-[1.3rem] lg:[&>.icon]:w-[1.65rem]"
            onClick={() => close()}
          >
            <FlipText>Fermer</FlipText>
            <span className="menu-close-icon before:content-[''] before:absolute before:size-8 lg:before:size-[2.15rem] before:rounded-full before:bg-accent before:opacity-0 before:scale-[.65] before:transition-[transform,opacity] before:duration-350 before:ease-[cubic-bezier(.22,1,.36,1)] before:-z-1 group-hover/menu:before:opacity-100 group-focus-visible/menu:before:opacity-100 group-hover/menu:before:scale-100 group-focus-visible/menu:before:scale-100 group-hover/menu:text-foreground group-focus-visible/menu:text-foreground [&>.icon]:size-full [&>.icon]:stroke-[1.2] [&>.icon]:transition-colors [&>.icon]:duration-250 relative isolate inline-grid h-[1.2rem] w-[1.5rem] place-items-center lg:h-[1.3rem] lg:w-[1.65rem]">
              <Icon name="close" />
            </span>
          </button>
        </div>
        <MenuBody pathname={pathname} select={select} />
      </dialog>
    </div>
  );
}
