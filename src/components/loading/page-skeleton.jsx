import Skeleton from "@/components/ui/skeleton";
import CollectionSkeleton from "./collection-skeleton";

export default function PageSkeleton({ variant = "page" }) {
  return (
    <main
      id="main"
      className="route-loading min-h-svh py-12 lg:py-16"
      aria-busy="true"
    >
      <output className="sr-only">Chargement de la page…</output>
      {variant === "artwork" ? (
        <div className="page-gutter grid gap-10 lg:grid-cols-2">
          <div aria-hidden="true">
            <Skeleton className="mb-12 h-4 w-24" />
            <Skeleton className="h-20 w-4/5" />
            <Skeleton className="mt-6 h-5 w-1/2" />
            <Skeleton className="mt-4 h-4 w-1/4" />
          </div>
          <Skeleton className="aspect-[4/5] w-full" />
        </div>
      ) : (
        <>
          <div className="page-gutter mb-12" aria-hidden="true">
            <Skeleton className="h-16 w-2/3 max-w-xl lg:h-24" />
            <Skeleton className="mt-5 h-4 w-1/3 max-w-xs" />
          </div>
          <CollectionSkeleton />
        </>
      )}
    </main>
  );
}
