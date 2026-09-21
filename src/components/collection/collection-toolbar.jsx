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
    <div className="collection-toolbar max-lg:[&_input]:text-[max(16px,.8rem)] max-lg:[&_select]:text-[max(16px,.8rem)] grid grid-cols-2 gap-4 border-y border-line py-6 lg:grid-cols-[1.6fr_1fr_1fr_.9fr]">
      <label className="field-label flex flex-col gap-[.55rem] text-[.7rem] text-muted first:col-span-full lg:text-[.65rem] lg:first:col-span-1">
        Rechercher
        <input
          className="w-full min-w-0 rounded-none border-b border-line bg-transparent px-0 py-[.6rem] text-[max(.8rem,16px)] text-ink lg:px-2 lg:py-[.7rem] lg:text-[.8rem]"
          type="search"
          placeholder="Titre, artiste, mouvement…"
          value={query}
          onChange={(event) => change("q", event.target.value)}
        />
      </label>
      <label className="field-label flex flex-col gap-[.55rem] text-[.7rem] text-muted first:col-span-full lg:text-[.65rem] lg:first:col-span-1">
        Mouvement
        <select
          className="w-full min-w-0 rounded-none border-b border-line bg-transparent px-0 py-[.6rem] text-[max(.8rem,16px)] text-ink lg:px-2 lg:py-[.7rem] lg:text-[.8rem]"
          value={movement}
          onChange={(event) => change("mouvement", event.target.value)}
        >
          <option value="">Tous les mouvements</option>
          {movements.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </label>
      <label className="field-label flex flex-col gap-[.55rem] text-[.7rem] text-muted first:col-span-full lg:text-[.65rem] lg:first:col-span-1">
        Artiste
        <select
          className="w-full min-w-0 rounded-none border-b border-line bg-transparent px-0 py-[.6rem] text-[max(.8rem,16px)] text-ink lg:px-2 lg:py-[.7rem] lg:text-[.8rem]"
          value={artist}
          onChange={(event) => change("artiste", event.target.value)}
        >
          <option value="">Tous les artistes</option>
          {artists.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </label>
      <label className="field-label flex flex-col gap-[.55rem] text-[.7rem] text-muted first:col-span-full lg:text-[.65rem] lg:first:col-span-1">
        Trier par
        <select
          className="w-full min-w-0 rounded-none border-b border-line bg-transparent px-0 py-[.6rem] text-[max(.8rem,16px)] text-ink lg:px-2 lg:py-[.7rem] lg:text-[.8rem]"
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
