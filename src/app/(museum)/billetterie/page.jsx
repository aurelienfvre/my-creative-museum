import TicketBuilder from "@/components/billetterie/ticket-builder";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata({
  path: "/billetterie",
  title: "Billetterie",
  description:
    "Composez votre visite : tarifs individuels, tarif groupe et guides. Calculez le total de votre sélection.",
});
export default function TicketsPage() {
  return (
    <main
      id="main"
      tabIndex={-1}
      className="page-gutter ticket-page pb-14 lg:pb-20"
    >
      <section
        className="tickets-cover mt-6 mb-8 block bg-transparent text-foreground sm:mt-8 sm:mb-10 lg:mt-16 lg:mb-20"
        data-arrive
      >
        <h1 className="text-[clamp(3rem,13vw,5rem)] font-normal leading-[1.12] tracking-[-0.07em] lg:text-[clamp(4rem,12.5vw,13rem)]">
          Billetterie<span aria-hidden="true">.</span>
        </h1>
      </section>
      <TicketBuilder />
    </main>
  );
}
