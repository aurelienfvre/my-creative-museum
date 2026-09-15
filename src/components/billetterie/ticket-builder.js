"use client";
import { useState } from "react";
import FlipText from "@/components/animation/flip-text";
import Icon from "@/components/ui/icon";
import MuseumLogo from "@/components/ui/museum-logo";
import "./ticket-summary.css";
import {
  extras,
  getTicketSummary,
  quantity,
  ticketTypes,
} from "@/lib/tickets.mjs";

const currency = (value) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
function Stepper({ label, value, maximum = 99, onChange }) {
  return (
    <div className="stepper">
      <button
        type="button"
        disabled={value === 0}
        onClick={() => onChange(-1)}
        aria-label={`Retirer : ${label}`}
      >
        <Icon name="minus" />
      </button>
      <output aria-label={`Quantité : ${label}`}>{value}</output>
      <button
        type="button"
        disabled={value >= maximum}
        onClick={() => onChange(1)}
        aria-label={`Ajouter : ${label}`}
      >
        <Icon name="plus" />
      </button>
    </div>
  );
}
export default function TicketBuilder() {
  const [counts, setCounts] = useState({});
  const [options, setOptions] = useState({});
  const summary = getTicketSummary(counts, options);
  function changeTicket(id, delta) {
    const current = counts[id] || 0;
    let next = quantity(current + delta);
    if (id === "group") {
      if (current === 0 && delta === 1) next = 11;
      if (current === 11 && delta === -1) next = 0;
    }
    const nextCounts = { ...counts, [id]: next };
    const { visitors } = getTicketSummary(nextCounts);
    setCounts(nextCounts);
    setOptions((previous) =>
      Object.fromEntries(
        Object.entries(previous).map(([key, value]) => [
          key,
          Math.min(value, visitors),
        ]),
      ),
    );
  }
  return (
    <div className="ticket-layout">
      <div>
        <section className="ticket-section">
          <h2>01. Vos visiteurs</h2>
          <p>
            Sélectionnez un tarif par personne. Le tarif groupe commence à 11
            entrées.
          </p>
          {ticketTypes.map((type) => (
            <div className="ticket-row" key={type.id}>
              <div>
                <h3>{type.label}</h3>
                <small>{type.detail}</small>
              </div>
              <span className="ticket-price">
                {type.price ? currency(type.price) : "Gratuit"}
              </span>
              <Stepper
                label={type.label}
                value={counts[type.id] || 0}
                onChange={(delta) => changeTicket(type.id, delta)}
              />
            </div>
          ))}
        </section>
        <section className="ticket-section">
          <h2>02. Vos guides</h2>
          <p>
            Choisissez le nombre de guides souhaités, dans la limite d’un de
            chaque type par visiteur.
          </p>
          {extras.map((type) => (
            <div className="ticket-row" key={type.id}>
              <div>
                <h3>{type.label}</h3>
                <small>{type.detail}</small>
              </div>
              <span className="ticket-price">{currency(type.price)}</span>
              <Stepper
                label={type.label}
                value={options[type.id] || 0}
                maximum={Math.min(99, summary.visitors)}
                onChange={(delta) =>
                  setOptions((previous) => ({
                    ...previous,
                    [type.id]: Math.min(
                      summary.visitors,
                      quantity((previous[type.id] || 0) + delta),
                    ),
                  }))
                }
              />
            </div>
          ))}
          <p className="mt-4">
            Le plan du musée est gratuit et fourni à l’accueil.
          </p>
        </section>
      </div>
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
          <button
            className="ticket-reset"
            type="button"
            onClick={() => {
              setCounts({});
              setOptions({});
            }}
          >
            <FlipText>Recommencer ma sélection</FlipText>
          </button>
        )}
      </aside>
    </div>
  );
}
