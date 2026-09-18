import Skeleton from "@/components/ui/skeleton";

export default function CollectionSkeleton() {
  return (
    <div aria-busy="true" className="page-gutter pb-16">
      <output className="sr-only">Chargement des œuvres…</output>
      <div
        aria-hidden="true"
        className="mb-10 grid grid-cols-2 gap-5 lg:grid-cols-4"
      >
        {[0, 1, 2, 3].map((item) => (
          <Skeleton key={item} className="h-12" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((item) => (
          <div key={item} aria-hidden="true">
            <Skeleton className="aspect-square w-full" />
            <Skeleton className="mt-5 h-5 w-2/3" />
            <Skeleton className="mt-3 h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
