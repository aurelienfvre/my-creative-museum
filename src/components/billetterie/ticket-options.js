import { currency } from "@/lib/format";
import QuantityStepper from "./quantity-stepper";
export default function TicketOptions({
  title,
  description,
  types,
  values,
  onChange,
  maximum = 99,
  freeLabel = false,
  children,
}) {
  return (
    <section className="ticket-section">
      <h2>{title}</h2>
      <p>{description}</p>
      {types.map((type) => (
        <div className="ticket-row" key={type.id}>
          <div>
            <h3>{type.label}</h3>
            <small>{type.detail}</small>
          </div>
          <span className="ticket-price">
            {freeLabel && !type.price ? "Gratuit" : currency(type.price)}
          </span>
          <QuantityStepper
            label={type.label}
            value={values[type.id] || 0}
            maximum={maximum}
            onChange={(delta) => onChange(type.id, delta)}
          />
        </div>
      ))}
      {children}
    </section>
  );
}
