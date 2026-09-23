import Skeleton from "@/components/ui/skeleton";
import CollectionSkeleton from "./collection-skeleton";

export default function PageSkeleton({ variant = "page" }) {
  return (
    <main
      id="main"
      tabIndex={-1}
      className="route-loading min-h-[calc(100svh_-_5rem)] py-6 lg:min-h-svh lg:py-16"
      aria-busy="true"
    >
      <output className="sr-only">Chargement de la page…</output>
      {variant === "artwork" ? (
        <div className="page-gutter grid gap-6 lg:grid-cols-2 lg:gap-10">
          <div aria-hidden="true">
            <Skeleton className="mb-5 h-11 w-24 lg:mb-12 lg:h-4" />
            <Skeleton className="h-16 w-4/5 sm:h-20" />
            <Skeleton className="mt-6 h-5 w-1/2" />
            <Skeleton className="mt-4 h-4 w-1/4" />
          </div>
          <Skeleton className="mx-auto aspect-[4/5] max-h-[65svh] w-full max-w-xl lg:max-h-none lg:max-w-none" />
        </div>
      ) : (
        <>
          <div className="page-gutter mb-8 lg:mb-12" aria-hidden="true">
            <Skeleton className="h-16 w-2/3 max-w-xl lg:h-24" />
            <Skeleton className="mt-5 h-4 w-1/3 max-w-xs" />
          </div>
          <CollectionSkeleton />
        </>
      )}
    </main>
  );
}
