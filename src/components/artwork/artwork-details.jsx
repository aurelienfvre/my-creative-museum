import Icon from "@/components/ui/icon";
import ArtworkImage from "./artwork-image";

function ArtworkDescription({ object, gallery }) {
  return (
    <div className="art-description">
      <h2
        id="artwork-description-title"
        className="mb-6 text-[2.3rem] lg:text-[2.7rem]"
      >
        Au-delà du <em>premier regard.</em>
      </h2>
      <p className="language-note mb-6 text-[.68rem] text-muted">
        Notice de la collection · Texte original en anglais
      </p>
      <div
        lang="en"
        className="prose max-w-[42rem] text-[.9rem] leading-[1.9] lg:text-base [&_p+p]:mt-6 [&_strong]:font-medium"
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
                className="text-[.8rem] text-foreground"
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
    <dl className="art-facts grid grid-cols-2 gap-x-4 lg:sticky lg:top-32 lg:block lg:self-start [&>div]:border-b [&>div]:border-line [&>div]:py-4 [&_dt]:mb-[.3rem] [&_dt]:text-[.65rem] [&_dt]:tracking-[.06em] [&_dt]:text-muted [&_dt]:uppercase [&_dd]:text-[.8rem] lg:[&_dd]:text-[.9rem]">
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
      <div>
        <dt>Palette</dt>
        <dd>{object.color || "Non renseignée"}</dd>
      </div>
      <div>
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
      className="detail-content page-gutter grid grid-cols-1 gap-8 py-10 lg:grid-cols-[1fr_2fr] lg:gap-20 lg:pt-16 lg:pb-20"
      data-reveal
    >
      <ArtworkFacts object={object} locationLink={locationLink} />
      <ArtworkDescription object={object} gallery={gallery} />
    </section>
  );
}
