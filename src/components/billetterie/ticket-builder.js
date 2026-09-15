"use client";
import { extras, ticketTypes } from "@/lib/tickets.mjs";
import TicketOptions from "./ticket-options";
import TicketSummary from "./ticket-summary";
import useTicketSelection from "./use-ticket-selection";
export default function TicketBuilder() {
  const { counts, options, summary, changeTicket, changeOption, reset } =
    useTicketSelection();
  return (
    <div className="ticket-layout grid grid-cols-1 items-start gap-4 lg:grid-cols-[1.7fr_1fr] lg:gap-20">
      <div>
        <TicketOptions
          title="01. Vos visiteurs"
          description="Sélectionnez un tarif par personne. Le tarif groupe commence à 11 entrées."
          types={ticketTypes}
          values={counts}
          onChange={changeTicket}
          freeLabel
        />
        <TicketOptions
          title="02. Vos guides"
          description="Choisissez le nombre de guides souhaités, dans la limite d’un de chaque type par visiteur."
          types={extras}
          values={options}
          onChange={changeOption}
          maximum={Math.min(99, summary.visitors)}
        >
          <p className="mt-4 mb-6 text-[.8rem] text-muted">
            Le plan du musée est gratuit et fourni à l’accueil.
          </p>
        </TicketOptions>
      </div>
      <TicketSummary summary={summary} onReset={reset} />
    </div>
  );
}
