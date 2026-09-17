import MuseumLogo from "@/components/ui/museum-logo";
export default function AuthShell({ title, children }) {
  return (
    <main
      id="main"
      className="page-gutter flex min-h-[calc(100svh-5rem)] lg:min-h-[calc(100svh-6.25rem)] items-center justify-center py-16 lg:py-24"
    >
      <section className="w-full max-w-[30rem] min-w-0">
        <MuseumLogo className="mb-8 size-12 text-foreground" />
        <h1 className="mb-10 text-[2.8rem] leading-none tracking-[-.055em] text-foreground lg:text-[3.6rem]">
          {title}
        </h1>
        {children}
      </section>
    </main>
  );
}
