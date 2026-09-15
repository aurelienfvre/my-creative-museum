import ArtworkImage from "@/components/artwork/artwork-image";
import MuseumLogo from "@/components/ui/museum-logo";
import { getObjects } from "@/lib/museum";
export const metadata = {
  title: "Le musée",
  description:
    "Un musée numérique ouvert à tous les regards. Découvrez l’esprit de My Creative Museum.",
};
export default async function MuseumPage() {
  const works = await getObjects();
  const work =
    works.find((item) => item.slug === "dance-at-the-moulin-de-la-galette") ||
    works[0];
  return (
    <main id="main">
      <section className="museum-cover page-gutter">
        <h1 data-arrive>
          Un musée.
          <br />
          <em>Sans mode d’emploi.</em>
        </h1>
        <div className="museum-cover-bottom" data-arrive>
          <MuseumLogo size={120} />
        </div>
      </section>
      <div className="museum-panorama" data-arrive>
        <ArtworkImage
          src={work.image}
          title={work.title}
          preload
          sizes="100vw"
        />
      </div>
      <section className="museum-story page-gutter" data-reveal>
        <h2>
          L’art commence
          <br />
          <em>par une rencontre.</em>
        </h2>
        <div>
          <p>
            Un visage, une lumière, un mouvement. Il suffit parfois d’un détail
            pour qu’une œuvre reste avec nous.
          </p>
          <p>
            My Creative Museum réunit des œuvres conservées dans les musées du
            monde entier. Une collection numérique à parcourir librement, pour
            découvrir les artistes, retrouver une peinture aimée ou s’arrêter
            sur une inconnue.
          </p>
          <p>
            Les reproductions et les notices vous accompagnent jusqu’aux lieux
            qui conservent les originaux. Parce qu’un écran peut aussi donner
            envie d’aller voir plus loin.
          </p>
        </div>
      </section>
    </main>
  );
}
