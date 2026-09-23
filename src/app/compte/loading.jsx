import Skeleton from "@/components/ui/skeleton";
export default function Loading() {
  return (
    <main
      id="main"
      tabIndex={-1}
      aria-busy="true"
      className="route-loading page-gutter min-h-[calc(100svh-5rem)] py-6 lg:min-h-svh lg:py-16"
    >
      <output className="sr-only">Chargement du profil…</output>
      <Skeleton className="mb-8 h-4 w-20 lg:mb-10" />
      <div className="flex items-center gap-4 sm:gap-6">
        <Skeleton className="size-14 shrink-0 sm:size-20 lg:size-32" />
        <div className="w-1/2">
          <Skeleton className="h-10 w-3/4 max-w-xs" />
          <Skeleton className="mt-3 h-4 w-full max-w-xs" />
          <Skeleton className="mt-5 h-5 w-2/3 max-w-48" />
        </div>
      </div>
      <Skeleton className="mt-10 mb-7 h-12 w-56 lg:mt-16 lg:mb-8" />
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <Skeleton key={item} className="aspect-square" />
        ))}
      </div>
    </main>
  );
}
