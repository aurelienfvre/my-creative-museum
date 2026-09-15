export function searchText(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
export function matchesSearch(object, query) {
  const haystack = searchText(
    `${object.title} ${object.artist} ${object.movement} ${object.year} ${object.color}`,
  );
  return searchText(query)
    .split(/\s+/)
    .every((word) => haystack.includes(word));
}
