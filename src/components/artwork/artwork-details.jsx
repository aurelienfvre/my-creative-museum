import Icon from "@/components/ui/icon";
import ArtworkImage from "./artwork-image";

function ArtworkDescription({ object, gallery }) {
  return (
    <div className="art-description min-w-0">
      <h2
        id="artwork-description-title"
        className="mb-4 text-[clamp(1.75rem,7vw,2.5rem)] lg:mb-6 lg:text-[2.7rem]"
      >
        Au-delà du <em>premier regard.</em>
      </h2>
      <p className="language-note mb-5 text-xs leading-relaxed text-muted lg:mb-6 lg:text-[.68rem]">
        Notice de la collection · Texte original en anglais
      </p>
      <div
        lang="en"
        className="prose max-w-[42rem] text-base leading-[1.75] [overflow-wrap:anywhere] lg:leading-[1.9] [&_p+p]:mt-6 [&_strong]:font-medium"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: HTML sanitized with sanitize-html in lib/museum.js.
        dangerouslySetInnerHTML={{ __html: object.description }}
      />
      {gallery.length > 0 && (
        <div className="art-gallery mt-8 flex flex-col gap-4 [&_.artwork-image]:h-72 lg:[&_.artwork-image]:h-100">
          {gallery.map((url, index) =>
            /\.(jpg|jpeg|png|webp)(\?|$)/i.test(url) &&
            ["upload.wikimedia.org", "www.moma.org"].includes(
              new URL(url).hostname,
            ) ? (
              <ArtworkImage
                key={url}
                src={url}
                title={`${object.title} — vue complémentaire ${index + 1}`}
                contain
              />
            ) : (
              <a
                className="inline-flex min-h-11 items-center gap-2 text-sm text-foreground lg:min-h-0 lg:text-[.8rem]"
                key={url}
                href={url}
                target="_blank"
                rel="noreferrer"
              >
                Consulter la ressource complémentaire {index + 1}{" "}
                <Icon name="arrowUpRight" />
                <span className="sr-only"> (nouvel onglet)</span>
              </a>
            ),
          )}
        </div>
      )}
    </div>
  );
}

function ArtworkFacts({ object, locationLink }) {
  return (
    <dl className="art-facts grid min-w-0 grid-cols-2 gap-x-5 lg:sticky lg:top-32 lg:block lg:self-start [&>div]:min-w-0 [&>div]:border-b [&>div]:border-line [&>div]:py-3 lg:[&>div]:py-4 [&_dt]:mb-1 [&_dt]:text-[.7rem] lg:[&_dt]:text-[.65rem] [&_dt]:tracking-[.06em] [&_dt]:text-muted [&_dt]:uppercase [&_dd]:text-sm [&_dd]:leading-relaxed [&_dd]:[overflow-wrap:anywhere] lg:[&_dd]:text-[.9rem] lg:[&_dd]:leading-normal">
      <div>
        <dt>Artiste</dt>
        <dd>{object.artist}</dd>
      </div>
      <div>
        <dt>Année</dt>
        <dd>{object.year}</dd>
      </div>
      <div>
        <dt>Technique</dt>
        <dd>
          {object.type === "painting"
            ? "Peinture"
            : object.type === "woodblock print"
              ? "Estampe sur bois"
              : object.type}
        </dd>
      </div>
      <div>
        <dt>Mouvement</dt>
        <dd>{object.movement || "Non renseigné"}</dd>
      </div>
      <div className="col-span-full sm:col-span-1">
        <dt>Palette</dt>
        <dd>{object.color || "Non renseignée"}</dd>
      </div>
      <div className="col-span-full sm:col-span-1">
        <dt>Lieu de conservation</dt>
        <dd>
          {locationLink ? (
            <a
              className="text-foreground underline underline-offset-[.2em]"
              href={locationLink}
              target="_blank"
              rel="noreferrer"
            >
              {object.location} <Icon name="arrowUpRight" />
              <span className="sr-only"> (nouvel onglet)</span>
            </a>
          ) : (
            object.location
          )}
        </dd>
      </div>
    </dl>
  );
}

export default function ArtworkDetails({ object, locationLink, gallery }) {
  return (
    <section
      aria-labelledby="artwork-description-title"
      className="detail-content page-gutter grid grid-cols-1 gap-10 py-8 lg:grid-cols-[1fr_2fr] lg:gap-20 lg:pt-16 lg:pb-20"
      data-reveal
    >
      <ArtworkFacts object={object} locationLink={locationLink} />
      <ArtworkDescription object={object} gallery={gallery} />
    </section>
  );
}
