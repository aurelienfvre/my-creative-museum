import { Suspense } from "react";
import Collection from "@/components/collection/collection";
import CollectionSkeleton from "@/components/loading/collection-skeleton";
import { pageMetadata } from "@/lib/metadata";
import { getObjects, publicObject } from "@/lib/museum";
export async function generateMetadata({ searchParams }) {
  const { q } = await searchParams;
  return pageMetadata({
    path: "/collection",
    title: q ? `Recherche : ${String(q).slice(0, 100)}` : "La collection",
    description:
      "Parcourez la collection, filtrez par artiste ou mouvement et découvrez chaque œuvre en détail.",
  });
}
export default async function CollectionPage() {
  const objects = await getObjects();
  return (
    <main id="main" tabIndex={-1}>
      <section className="collection-cover page-gutter pt-8 pb-8 lg:pt-16 lg:pb-16">
        <h1
          className="flex items-start gap-2 text-[clamp(2.75rem,14vw,5rem)] leading-none font-normal tracking-[-.075em] text-foreground lg:gap-4 lg:text-[16rem]"
          data-arrive
        >
          Collection
          <span className="collection-total shrink-0 pt-[.3rem] font-editorial text-base tracking-[-.04em] lg:pt-4 lg:text-[2.2rem]">
            ({objects.length})
          </span>
        </h1>
      </section>
      <Suspense fallback={<CollectionSkeleton />}>
        <Collection objects={objects.map(publicObject)} />
      </Suspense>
    </main>
  );
}
