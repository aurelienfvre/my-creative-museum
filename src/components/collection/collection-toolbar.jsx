export default function CollectionToolbar({
  query,
  movement,
  artist,
  sort,
  movements,
  artists,
  change,
}) {
  return (
    <div className="collection-toolbar grid grid-cols-2 gap-x-4 gap-y-5 border-y border-line py-5 lg:grid-cols-[1.6fr_1fr_1fr_.9fr] lg:gap-4 lg:py-6">
      <label className="field-label col-span-full flex min-w-0 flex-col gap-1 text-xs text-muted lg:col-span-1 lg:gap-[.55rem] lg:text-[.65rem]">
        Rechercher
        <input
          className="min-h-11 w-full min-w-0 rounded-none border-b border-line bg-transparent px-0 py-2 text-base text-ink lg:min-h-0 lg:px-2 lg:py-[.7rem] lg:text-[.8rem]"
          type="search"
          placeholder="Titre, artiste, mouvement…"
          value={query}
          onChange={(event) => change("q", event.target.value)}
        />
      </label>
      <label className="field-label flex min-w-0 flex-col gap-1 text-xs text-muted lg:gap-[.55rem] lg:text-[.65rem]">
        Mouvement
        <select
          className="min-h-11 w-full min-w-0 truncate rounded-none border-b border-line bg-transparent px-0 py-2 text-base text-ink lg:min-h-0 lg:px-2 lg:py-[.7rem] lg:text-[.8rem]"
          value={movement}
          onChange={(event) => change("mouvement", event.target.value)}
        >
          <option value="">Tous les mouvements</option>
          {movements.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </label>
      <label className="field-label flex min-w-0 flex-col gap-1 text-xs text-muted lg:gap-[.55rem] lg:text-[.65rem]">
        Artiste
        <select
          className="min-h-11 w-full min-w-0 truncate rounded-none border-b border-line bg-transparent px-0 py-2 text-base text-ink lg:min-h-0 lg:px-2 lg:py-[.7rem] lg:text-[.8rem]"
          value={artist}
          onChange={(event) => change("artiste", event.target.value)}
        >
          <option value="">Tous les artistes</option>
          {artists.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </label>
      <label className="field-label col-span-full flex min-w-0 flex-col gap-1 text-xs text-muted sm:col-span-1 lg:gap-[.55rem] lg:text-[.65rem]">
        Trier par
        <select
          className="min-h-11 w-full min-w-0 truncate rounded-none border-b border-line bg-transparent px-0 py-2 text-base text-ink lg:min-h-0 lg:px-2 lg:py-[.7rem] lg:text-[.8rem]"
          value={sort}
          onChange={(event) => change("tri", event.target.value)}
        >
          <option value="selection">La sélection</option>
          <option value="ancien">Date croissante</option>
          <option value="recent">Date décroissante</option>
          <option value="titre">Titre A à Z</option>
        </select>
      </label>
    </div>
  );
}
