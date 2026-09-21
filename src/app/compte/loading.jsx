import Skeleton from "@/components/ui/skeleton";
export default function Loading() {
  return (
    <main
      id="main"
      aria-busy="true"
      className="route-loading page-gutter min-h-svh py-12 lg:py-16"
    >
      <output className="sr-only">Chargement du profil…</output>
      <Skeleton className="mb-10 h-4 w-20" />
      <div className="flex items-center gap-6">
        <Skeleton className="size-20 shrink-0 lg:size-32" />
        <div className="w-1/2">
          <Skeleton className="h-10 w-3/4 max-w-xs" />
          <Skeleton className="mt-3 h-4 w-full max-w-xs" />
          <Skeleton className="mt-5 h-5 w-2/3 max-w-48" />
        </div>
      </div>
      <Skeleton className="mt-16 mb-8 h-12 w-56" />
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <Skeleton key={item} className="aspect-square" />
        ))}
      </div>
    </main>
  );
}
