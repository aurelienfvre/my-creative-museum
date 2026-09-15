export const ticketTypes = [
  { id: "adult", label: "Adulte", detail: "Plein tarif", price: 24 },
  { id: "child", label: "Enfant", detail: "De 5 à 11 ans", price: 12 },
  { id: "young", label: "Jeune", detail: "De 12 à 25 ans", price: 18 },
  {
    id: "jobseeker",
    label: "Demandeur d’emploi",
    detail: "Sur présentation d’un justificatif",
    price: 18,
  },
  {
    id: "access",
    label: "Personne à mobilité réduite",
    detail: "Tarif réduit",
    price: 18,
  },
  { id: "senior", label: "Senior", detail: "Tarif réduit", price: 18 },
  { id: "infant", label: "Tout-petit", detail: "Moins de 5 ans", price: 0 },
  {
    id: "group",
    label: "Groupe",
    detail: "À partir de 11 personnes · par personne",
    price: 15,
  },
];
export const extras = [
  {
    id: "audio",
    label: "Audioguide",
    detail: "Un autre regard sur les œuvres",
    price: 2,
  },
  {
    id: "paper",
    label: "Guide papier",
    detail: "Pour garder une trace de la visite",
    price: 4,
  },
];
export function quantity(value) {
  return Math.min(99, Math.max(0, Math.trunc(Number(value) || 0)));
}
export function getTicketSummary(counts = {}, options = {}) {
  const lines = ticketTypes
    .map((type) => ({
      ...type,
      count:
        type.id === "group" && quantity(counts[type.id]) < 11
          ? 0
          : quantity(counts[type.id]),
    }))
    .filter((line) => line.count > 0);
  const visitors = lines.reduce((sum, line) => sum + line.count, 0);
  const optionLines = extras
    .map((type) => ({
      ...type,
      count: Math.min(quantity(options[type.id]), visitors),
    }))
    .filter((line) => line.count > 0);
  const allLines = [...lines, ...optionLines];
  return {
    visitors,
    lines: allLines,
    total: allLines.reduce((sum, line) => sum + line.count * line.price, 0),
  };
}
