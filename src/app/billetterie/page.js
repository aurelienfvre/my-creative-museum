import TicketBuilder from "@/components/billetterie/ticket-builder";
export const metadata = {
  title: "Billetterie",
  description:
    "Composez votre visite : tarifs individuels, tarif groupe et guides. Calculez le total de votre sélection.",
};
export default function TicketsPage() {
  return (
    <main id="main" className="page-gutter ticket-page">
      <section className="tickets-cover" data-arrive>
        <h1>
          Billetterie<span aria-hidden="true">.</span>
        </h1>
      </section>
      <TicketBuilder />
    </main>
  );
}
