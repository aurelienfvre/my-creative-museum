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
    <div className="collection-toolbar">
      <label className="field-label">
        Rechercher
        <input
          type="search"
          placeholder="Titre, artiste, mouvement…"
          value={query}
          onChange={(event) => change("q", event.target.value)}
        />
      </label>
      <label className="field-label">
        Mouvement
        <select
          value={movement}
          onChange={(event) => change("mouvement", event.target.value)}
        >
          <option value="">Tous les mouvements</option>
          {movements.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </label>
      <label className="field-label">
        Artiste
        <select
          value={artist}
          onChange={(event) => change("artiste", event.target.value)}
        >
          <option value="">Tous les artistes</option>
          {artists.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </label>
      <label className="field-label">
        Trier par
        <select
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
