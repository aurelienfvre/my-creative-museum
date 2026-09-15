import FlipText from "@/components/animation/flip-text";
import Icon from "@/components/ui/icon";
import MuseumLogo from "@/components/ui/museum-logo";
import { currency } from "@/lib/format";
import "./ticket-summary.css";
export default function TicketSummary({ summary, onReset }) {
  return (
    <aside
      className="ticket-summary"
      aria-label="Récapitulatif de votre visite"
    >
      <div className="ticket-summary-brand">
        <MuseumLogo size={45} />
        <span>
          My Creative
          <br />
          Museum
        </span>
      </div>
      <h2>
        Votre <em>sélection.</em>
      </h2>
      <div aria-live="polite" aria-atomic="true">
        {summary.lines.length ? (
          summary.lines.map((line) => (
            <div className="summary-line" key={line.id}>
              <span>
                {line.count} <Icon name="close" className="quantity-icon" />{" "}
                {line.label}
              </span>
              <span>{currency(line.count * line.price)}</span>
            </div>
          ))
        ) : (
          <p className="summary-empty">
            Ajoutez vos visiteurs pour composer votre visite.
          </p>
        )}
        <div className="summary-total">
          <span>Total</span>
          <strong>{currency(summary.total)}</strong>
        </div>
      </div>
      <div className="ticket-admission">
        <span>Entrées</span>
        <span>
          {String(summary.visitors).padStart(2, "0")}{" "}
          <small>{summary.visitors > 1 ? "visiteurs" : "visiteur"}</small>
        </span>
      </div>
      {summary.visitors > 0 && (
        <button className="ticket-reset" type="button" onClick={onReset}>
          <FlipText>Recommencer ma sélection</FlipText>
        </button>
      )}
    </aside>
  );
}
