import MuseumLogo from "@/components/ui/museum-logo";
export default function AuthLayout({ children }) {
  return (
    <main
      id="main"
      tabIndex={-1}
      className="page-gutter flex min-h-[calc(100svh-5rem)] lg:min-h-[calc(100svh-6.25rem)] items-center justify-center py-8 sm:py-12 lg:py-24"
    >
      <section className="w-full max-w-[30rem] min-w-0">
        <MuseumLogo className="mb-6 size-12 text-foreground lg:mb-8" />
        {children}
      </section>
    </main>
  );
}
