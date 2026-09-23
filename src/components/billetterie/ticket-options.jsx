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
    <section className="ticket-section mb-8 border-t border-line pt-5 lg:pt-[1.7rem]">
      <h2 className="mb-3 text-[1.5rem] lg:mb-4 lg:text-[1.6rem]">{title}</h2>
      <p className="mb-4 max-w-xl text-sm leading-relaxed text-muted lg:mb-6 lg:text-[.8rem]">
        {description}
      </p>
      {types.map((type) => (
        <div
          className="ticket-row grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 border-b border-line py-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] lg:gap-6 lg:py-[1.2rem]"
          key={type.id}
        >
          <div className="col-span-2 min-w-0 sm:col-span-1">
            <h3 className="text-base font-normal lg:text-[.95rem]">
              {type.label}
            </h3>
            <small className="mt-1 block text-xs leading-relaxed text-muted lg:mt-[.15rem] lg:text-[.7rem]">
              {type.detail}
            </small>
          </div>
          <span className="ticket-price whitespace-nowrap text-sm text-foreground lg:text-[.95rem]">
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
