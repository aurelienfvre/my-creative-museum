import FlipText from "@/components/animation/flip-text";
import Icon from "@/components/ui/icon";
import MuseumLogo from "@/components/ui/museum-logo";
import { currency } from "@/lib/format";
import "./ticket-summary.css";
export default function TicketSummary({ summary, onReset }) {
  return (
    <aside
      className="ticket-summary top-[7.5rem] border border-[rgb(36_59_186_/_0.22)] bg-[#faf9f4] px-8 pt-8 pb-6 text-foreground shadow-[0_12px_30px_-24px_rgb(36_59_186_/_0.22)] lg:sticky lg:max-h-[calc(100svh-9rem)] lg:overflow-y-auto"
      aria-label="Récapitulatif de votre visite"
    >
      <div className="ticket-summary-brand mb-10 flex items-center gap-[.65rem] [&_svg]:size-[2.8rem]">
        <MuseumLogo size={45} />
        <span className="text-[.7rem] leading-[1.12] tracking-[-.02em]">
          My Creative
          <br />
          Museum
        </span>
      </div>
      <h2 className="mb-8 font-sans text-[2.7rem] leading-none font-normal tracking-[-.04em]">
        Votre <em className="font-editorial font-normal">sélection.</em>
      </h2>
      <div aria-live="polite" aria-atomic="true">
        {summary.lines.length ? (
          summary.lines.map((line) => (
            <div
              className="summary-line flex justify-between gap-4 py-[.45rem] text-[.8rem] text-ink"
              key={line.id}
            >
              <span>
                {line.count} <Icon name="close" className="quantity-icon" />{" "}
                {line.label}
              </span>
              <span className="whitespace-nowrap tabular-nums">
                {currency(line.count * line.price)}
              </span>
            </div>
          ))
        ) : (
          <p className="summary-empty min-h-12 max-w-68 text-[.8rem] leading-[1.6] text-muted">
            Ajoutez vos visiteurs pour composer votre visite.
          </p>
        )}
        <div className="summary-total mt-6 flex items-baseline justify-between pb-[1.8rem]">
          <span className="text-[.8rem]">Total</span>
          <strong className="text-[4rem] font-normal tracking-[-.06em] tabular-nums">
            {currency(summary.total)}
          </strong>
        </div>
      </div>
      <div className="ticket-admission relative -mx-8 flex items-baseline justify-between border-t border-dashed border-[rgb(36_59_186_/_0.35)] px-8 pt-6 text-[.75rem]">
        <span>Entrées</span>
        <span className="text-[1.6rem] tracking-[-.04em]">
          {String(summary.visitors).padStart(2, "0")}{" "}
          <small className="text-[.7rem] tracking-normal">
            {summary.visitors > 1 ? "visiteurs" : "visiteur"}
          </small>
        </span>
      </div>
      {summary.visitors > 0 && (
        <button
          className="ticket-reset mt-4 border-b text-[.65rem] text-inherit opacity-70"
          type="button"
          onClick={onReset}
        >
          <FlipText>Recommencer ma sélection</FlipText>
        </button>
      )}
    </aside>
  );
}
