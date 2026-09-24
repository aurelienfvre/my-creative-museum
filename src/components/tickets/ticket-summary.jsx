import FlipText from "@/components/animation/flip-text";
import Icon from "@/components/ui/icon";
import MuseumLogo from "@/components/ui/museum-logo";
import { currency } from "@/lib/format";
export default function TicketSummary({ summary, onReset }) {
  return (
    <aside
      className="ticket-summary min-w-0 overflow-x-hidden top-[7.5rem] border border-[rgb(36_59_186_/_0.22)] bg-[#faf9f4] px-5 py-6 text-foreground shadow-[0_12px_30px_-24px_rgb(36_59_186_/_0.22)] sm:px-8 lg:sticky lg:max-h-[calc(100svh-9rem)] lg:overflow-y-auto lg:pt-8"
      aria-label="Récapitulatif de votre visite"
      tabIndex={-1}
    >
      <div className="ticket-summary-brand mb-6 flex items-center gap-[.65rem] lg:mb-10 [&_svg]:size-[2.8rem]">
        <MuseumLogo size={45} />
        <span className="text-[.7rem] leading-[1.12] tracking-[-.02em]">
          My Creative
          <br />
          Museum
        </span>
      </div>
      <h2 className="mb-6 font-sans text-[clamp(2rem,8vw,2.7rem)] leading-none font-normal tracking-[-.04em] lg:mb-8 lg:text-[2.7rem]">
        Votre <em className="font-editorial font-normal">sélection.</em>
      </h2>
      <div aria-live="polite" aria-atomic="true">
        {summary.lines.length ? (
          summary.lines.map((line) => (
            <div
              className="summary-line flex justify-between gap-4 py-2 text-sm text-ink lg:py-[.45rem] lg:text-[.8rem]"
              key={line.id}
            >
              <span className="min-w-0">
                {line.count} <Icon name="close" className="size-[.65em]" />{" "}
                {line.label}
              </span>
              <span className="whitespace-nowrap tabular-nums">
                {currency(line.count * line.price)}
              </span>
            </div>
          ))
        ) : (
          <p className="summary-empty min-h-12 max-w-68 text-sm leading-[1.6] text-muted lg:text-[.8rem]">
            Ajoutez vos visiteurs pour composer votre visite.
          </p>
        )}
        <div className="summary-total mt-5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 pb-6 lg:mt-6 lg:pb-[1.8rem]">
          <span className="text-sm lg:text-[.8rem]">Total</span>
          <strong className="max-w-full text-[clamp(2rem,9vw,3rem)] font-normal tracking-[-.06em] tabular-nums lg:text-[4rem]">
            {currency(summary.total)}
          </strong>
        </div>
      </div>
      <div className="relative before:content-[''] after:content-[''] before:absolute after:absolute before:top-[-.55rem] after:top-[-.55rem] before:size-[1.1rem] after:size-[1.1rem] before:bg-background after:bg-background before:rounded-full after:rounded-full before:border after:border before:border-foreground/22 after:border-foreground/22 before:left-[-.6rem] after:right-[-.6rem] overflow-x-clip -mx-5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-t border-dashed border-[rgb(36_59_186_/_0.35)] px-5 pt-5 text-sm sm:-mx-8 sm:px-8 lg:pt-6 lg:text-[.75rem]">
        <span>Entrées</span>
        <span className="text-[1.6rem] tracking-[-.04em]">
          {String(summary.visitors).padStart(2, "0")}{" "}
          <small className="text-xs tracking-normal lg:text-[.7rem]">
            {summary.visitors > 1 ? "visiteurs" : "visiteur"}
          </small>
        </span>
      </div>
      {summary.visitors > 0 && (
        <button
          className="ticket-reset mt-3 min-h-11 border-b text-xs text-inherit opacity-70 lg:mt-4 lg:min-h-0 lg:text-[.65rem]"
          type="button"
          onClick={(event) => {
            event.currentTarget
              .closest("aside")
              ?.focus({ preventScroll: true });
            onReset();
          }}
        >
          <FlipText>Recommencer ma sélection</FlipText>
        </button>
      )}
    </aside>
  );
}
