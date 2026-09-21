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
      className="page-gutter ticket-page px-5 pb-20 lg:px-14"
    >
      <section
        className="tickets-cover mt-8 mb-12 block bg-transparent text-foreground lg:mt-16 lg:mb-20"
        data-arrive
      >
        <h1 className="text-[4.15rem] font-normal leading-[1.12] tracking-[-0.07em] lg:text-[clamp(4rem,12.5vw,13rem)]">
          Billetterie<span aria-hidden="true">.</span>
        </h1>
      </section>
      <TicketBuilder />
    </main>
  );
}
