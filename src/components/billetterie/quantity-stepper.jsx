import Icon from "@/components/ui/icon";
export default function QuantityStepper({
  label,
  value,
  maximum = 99,
  onChange,
}) {
  return (
    <div className="stepper flex items-center gap-[.4rem] lg:gap-[.7rem]">
      <button
        type="button"
        className="grid size-[1.9rem] place-items-center rounded-full border border-line enabled:hover:bg-foreground enabled:hover:text-white"
        disabled={value === 0}
        onClick={() => onChange(-1)}
        aria-label={`Retirer : ${label}`}
      >
        <Icon name="minus" />
      </button>
      <output
        className="min-w-[1.2rem] text-center text-[.85rem]"
        aria-label={`Quantité : ${label}`}
      >
        {value}
      </output>
      <button
        type="button"
        className="grid size-[1.9rem] place-items-center rounded-full border border-line enabled:hover:bg-foreground enabled:hover:text-white"
        disabled={value >= maximum}
        onClick={() => onChange(1)}
        aria-label={`Ajouter : ${label}`}
      >
        <Icon name="plus" />
      </button>
    </div>
  );
}
