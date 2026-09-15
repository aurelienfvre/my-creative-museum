import Icon from "@/components/ui/icon";
export default function QuantityStepper({
  label,
  value,
  maximum = 99,
  onChange,
}) {
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
