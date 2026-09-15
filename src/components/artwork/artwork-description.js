import Icon from "@/components/ui/icon";
import ArtworkImage from "./artwork-image";
export default function ArtworkDescription({ object, gallery }) {
  return (
    <div className="art-description">
      <h2 className="mb-6 text-[2.3rem] lg:text-[2.7rem]">
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
              </a>
            ),
          )}
        </div>
      )}
    </div>
  );
}
