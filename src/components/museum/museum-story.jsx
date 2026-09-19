import ArtworkImage from "@/components/artwork/artwork-image";

export default function MuseumStory({ works }) {
  return (
    <>
      <div
        data-art-stream
        aria-hidden="true"
        className="pointer-events-none invisible absolute inset-0 opacity-0 [perspective:1000px] motion-reduce:hidden"
      >
        {works.map((work, index) => (
          <div
            key={work.slug}
            data-stream-art
            className="absolute w-[19%] opacity-60 lg:w-[21%]"
            style={{
              left: `${index % 2 ? 77 : 2}%`,
              top: `${85 + index * 42}%`,
              transform: `translateZ(-140px) rotateY(${index % 2 ? -10 : 10}deg)`,
            }}
          >
            <ArtworkImage
              src={work.image}
              title={work.title}
              eager
              contain
              className="aspect-[3/4] bg-transparent!"
              sizes="25vw"
            />
          </div>
        ))}
      </div>
      <p
        data-story-detail
        className="pointer-events-none invisible absolute inset-x-[8%] bottom-[5%] z-20 text-center text-[1.6rem] leading-tight tracking-tight text-foreground opacity-0 lg:inset-x-[26%] lg:bottom-[5%] lg:text-[2.4rem]"
      >
        Des siècles d’art.
        <br />
        <em className="font-editorial">Votre regard.</em>
      </p>
      <div
        data-story-perspective
        className="pointer-events-none invisible absolute inset-x-[8%] bottom-[12%] z-20 max-w-xl text-white opacity-0 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
      >
        <p className="text-[2rem] leading-[1.02] tracking-tight lg:text-[3.8rem]">
          Derrière chaque œuvre,
          <br />
          <em className="font-editorial text-white!">une histoire.</em>
        </p>
        <p className="mt-5 max-w-sm text-base leading-relaxed">
          Retrouvez son artiste, son époque et le musée qui conserve l’original.
        </p>
      </div>
      <div
        data-story-ending
        className="pointer-events-none invisible absolute inset-x-[8%] bottom-[8%] z-20 opacity-0 lg:bottom-auto lg:left-[59%] lg:right-[8%] lg:top-[35%]"
      >
        <p className="text-[2rem] leading-[1.02] tracking-tight lg:text-[3.8rem]">
          Prenez le temps
          <br />
          de <em className="font-editorial text-foreground">voir.</em>
        </p>
        <p className="mt-5 max-w-sm text-base leading-relaxed text-muted">
          Un détail, une couleur, une émotion. Chaque visite commence par ce qui
          vous touche.
        </p>
      </div>
    </>
  );
}
