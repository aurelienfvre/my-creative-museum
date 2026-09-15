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
    <section className="ticket-section mb-8 border-t border-line pt-[1.7rem]">
      <h2 className="mb-4 text-[1.6rem]">{title}</h2>
      <p className="mb-6 text-[.8rem] text-muted">{description}</p>
      {types.map((type) => (
        <div
          className="ticket-row grid grid-cols-[1fr_auto_auto] items-center gap-[.7rem] border-b border-line py-[1.2rem] lg:gap-6"
          key={type.id}
        >
          <div>
            <h3 className="text-[.85rem] font-normal lg:text-[.95rem]">
              {type.label}
            </h3>
            <small className="mt-[.15rem] block text-[.65rem] text-muted lg:text-[.7rem]">
              {type.detail}
            </small>
          </div>
          <span className="ticket-price text-[.85rem] text-foreground lg:text-[.95rem]">
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
