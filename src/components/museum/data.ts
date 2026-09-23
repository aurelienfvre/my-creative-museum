export const introContent = {
  portraitSlug: "girl-with-a-pearl-earring",
  streamLimit: 12,
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
    text: "Un détail, une couleur, une émotion. Chaque visite commence par ce qui vous touche.",
  },
} as const;

// Positions and sizes are percentages; pointer travel is in pixels.
export const streamPlanes = [
  {
    layer: "z-0",
    opacity: 0.65,
    pointerTravel: 10,
    desktop: { width: 9, left: 8, right: 84 },
    mobile: { width: 13, left: 1, right: 86 },
  },
  {
    layer: "z-5",
    opacity: 0.85,
    pointerTravel: 24,
    desktop: { width: 13, left: 25, right: 71 },
    mobile: { width: 17, left: 4, right: 81 },
  },
  {
    layer: "z-15",
    opacity: 1,
    pointerTravel: 48,
    desktop: { width: 18, left: 2, right: 80 },
    mobile: { width: 22, left: -2, right: 76 },
  },
] as const;

export const artistChapters = [
  {
    artist: "Rembrandt van Rijn",
    title: "Dans l’ombre, la lumière",
    reflection: "La lumière change. Le regard aussi.",
  },
  {
    artist: "Vincent van Gogh",
    title: "La nuit en couleurs",
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
