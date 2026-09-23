// Each plane has its own scroll distance, mouse response and hanging positions.
export const streamPlanes = [
  {
    layer: "z-0",
    opacity: 0.8,
    pointerTravel: 14,
    scrollTravel: 2.45,
    exitTravel: 0.08,
    desktopWidth: "min(9vw, 16svh)",
    mobileWidth: "10vw",
    mobileLeft: 7,
    mobileRight: 83,
    works: [
      { slug: "starry-night", left: 26, top: 64 },
      { slug: "the-birth-of-venus", left: 73, top: 118 },
      {
        slug: "a-sunday-afternoon-on-the-island-of-la-grande-jatte",
        left: 6,
        top: 157,
      },
      { slug: "american-gothic", left: 69, top: 196 },
      { slug: "water-lilies", left: 24, top: 230 },
    ],
  },
  {
    layer: "z-5",
    opacity: 1,
    pointerTravel: 30,
    scrollTravel: 3,
    exitTravel: 0.12,
    desktopWidth: "min(13vw, 23svh)",
    mobileWidth: "14vw",
    mobileLeft: 3,
    mobileRight: 83,
    works: [
      { slug: "mona-lisa", left: 11, top: 88 },
      { slug: "the-persistence-of-memory", left: 78, top: 100 },
      { slug: "las-meninas", left: 23, top: 182 },
      { slug: "the-kiss", left: 78, top: 218 },
    ],
  },
  {
    layer: "z-15",
    opacity: 1,
    pointerTravel: 54,
    scrollTravel: 3.55,
    exitTravel: 0.18,
    desktopWidth: "min(22vw, 38svh)",
    mobileWidth: "18vw",
    mobileLeft: 1,
    mobileRight: 81,
    works: [
      { slug: "the-great-wave-off-kanagawa", left: 5, top: 128 },
      { slug: "the-arnolfini-portrait", left: 73, top: 198 },
      { slug: "the-night-watch", left: 9, top: 266 },
    ],
  },
] as const;

export const introContent = {
  portraitSlug: "girl-with-a-pearl-earring",
  streamSlugs: streamPlanes.flatMap((plane) =>
    plane.works.map((work) => work.slug),
  ),
  title: "Le musée",
  opening: "Des œuvres du monde entier.",
  description: "Un espace pour prendre le temps de les regarder.",
  detail: { opening: "Des siècles d’art.", emphasis: "Votre regard." },
  perspective: {
    opening: "Derrière chaque œuvre,",
    emphasis: "une histoire.",
    text: "Retrouvez son artiste, son époque et le musée qui conserve l’original.",
  },
  ending: {
    opening: "Prenez le temps",
    prefix: "de",
    emphasis: "voir.",
    text: "Le bleu du turban, la lumière sur la perle, un visage qui se tourne vers vous.",
  },
} as const;

export const artistChapters = [
  {
    artist: "Rembrandt van Rijn",
    title: "Dans l’ombre, la lumière",
    slugs: ["the-night-watch", "the-anatomy-lesson-of-dr-nicolaes-tulp"],
    reflection: "La lumière change.\nLe regard aussi.",
  },
  {
    artist: "Vincent van Gogh",
    title: "La nuit en couleurs",
    slugs: ["starry-night", "cafe-terrace-at-night"],
    reflection: null,
  },
] as const;

export const passageContent = {
  afterArtist: "Rembrandt van Rijn",
  opening: { cue: "D’abord,", text: "le trait." },
  ending: { cue: "Puis,", text: "la couleur." },
  slug: "the-kiss",
  ratio: 1,
  paper: "#f1ead9",
  ink: "#705021",
} as const;
