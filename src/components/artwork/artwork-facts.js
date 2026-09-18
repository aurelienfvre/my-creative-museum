import Icon from "@/components/ui/icon";
export default function ArtworkFacts({ object, locationLink }) {
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
            </a>
          ) : (
            object.location
          )}
        </dd>
      </div>
    </dl>
  );
}
