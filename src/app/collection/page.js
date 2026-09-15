import { Suspense } from "react";
import Collection from "@/components/collection/collection";
import { getObjects, publicObject } from "@/lib/museum";
export async function generateMetadata({ searchParams }) {
  const { q } = await searchParams;
  return {
    title: q ? `Recherche : ${String(q).slice(0, 100)}` : "La collection",
    description:
      "Parcourez la collection, filtrez par artiste ou mouvement et découvrez chaque œuvre en détail.",
  };
}
export default async function CollectionPage() {
  const objects = await getObjects();
  return (
    <main id="main">
      <section className="collection-cover page-gutter">
        <h1 data-arrive>
          Collection<span className="collection-total">({objects.length})</span>
        </h1>
      </section>
      <Suspense
        fallback={<p className="page-gutter">Préparation de la collection…</p>}
      >
        <Collection objects={objects.map(publicObject)} />
      </Suspense>
    </main>
  );
}
