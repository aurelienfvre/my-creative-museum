import ArtworkImage from "@/components/artwork/artwork-image";
import MuseumLogo from "@/components/ui/museum-logo";
import { pageMetadata } from "@/lib/metadata";
import { getObjects } from "@/lib/museum";
export const metadata = pageMetadata({
  path: "/musee",
  title: "Le musée",
  description:
    "Un musée numérique ouvert à tous les regards. Découvrez l’esprit de My Creative Museum.",
});
export default async function MuseumPage() {
  const works = await getObjects();
  const work =
    works.find((item) => item.slug === "dance-at-the-moulin-de-la-galette") ||
    works[0];
  return (
    <main id="main">
      <section className="museum-cover page-gutter px-5 py-12 text-foreground lg:px-14 lg:py-16">
        <h1
          className="text-[3.5rem] font-normal leading-none tracking-[-0.06em] lg:text-[7rem]"
          data-arrive
        >
          Un musée.
          <br />
          <em className="font-editorial font-normal">Sans mode d’emploi.</em>
        </h1>
        <div
          className="museum-cover-bottom flex items-end justify-between pt-12 [&>svg]:size-16 [&>svg]:rotate-[8deg] lg:[&>svg]:size-24"
          data-arrive
        >
          <MuseumLogo size={120} />
        </div>
      </section>
      <div
        className="museum-panorama [&_.artwork-image]:h-[22rem] lg:[&_.artwork-image]:h-[35rem]"
        data-arrive
      >
        <ArtworkImage
          src={work.image}
          title={work.title}
          preload
          sizes="100vw"
        />
      </div>
      <section
        className="museum-story page-gutter grid grid-cols-1 gap-8 px-5 py-14 lg:grid-cols-[1.3fr_1fr] lg:gap-24 lg:px-14 lg:py-28"
        data-reveal
      >
        <h2 className="text-[2.7rem] lg:text-[4rem]">
          L’art commence
          <br />
          <em>par une rencontre.</em>
        </h2>
        <div>
          <p className="mb-[1.6rem] text-[1rem] leading-[1.7]">
            Un visage, une lumière, un mouvement. Il suffit parfois d’un détail
            pour qu’une œuvre reste avec nous.
          </p>
          <p className="mb-[1.6rem] text-[1rem] leading-[1.7]">
            My Creative Museum réunit des œuvres conservées dans les musées du
            monde entier. Une collection numérique à parcourir librement, pour
            découvrir les artistes, retrouver une peinture aimée ou s’arrêter
            sur une inconnue.
          </p>
          <p className="mb-[1.6rem] text-[1rem] leading-[1.7]">
            Les reproductions et les notices vous accompagnent jusqu’aux lieux
            qui conservent les originaux. Parce qu’un écran peut aussi donner
            envie d’aller voir plus loin.
          </p>
        </div>
      </section>
    </main>
  );
}
