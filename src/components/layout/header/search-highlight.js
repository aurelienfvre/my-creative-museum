import { searchText } from "@/lib/search";

export default function SearchHighlight({ text, query }) {
  const tokens = searchText(query).split(/\s+/).filter(Boolean);
  const characters = Array.from(text);
  const offsets = [];
  let normalized = "";
  for (const [index, character] of characters.entries()) {
    const plain = character
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    normalized += plain;
    for (let i = 0; i < plain.length; i++) offsets.push(index);
  }
  const highlighted = new Set();
  for (const token of tokens) {
    let start = normalized.indexOf(token);
    while (start !== -1) {
      for (let i = start; i < start + token.length; i++)
        highlighted.add(offsets[i]);
      start = normalized.indexOf(token, start + 1);
    }
  }
  const parts = [];
  for (const [index, character] of characters.entries()) {
    const marked = highlighted.has(index);
    const previous = parts.at(-1);
    if (previous && previous.marked === marked) previous.text += character;
    else parts.push({ text: character, marked, start: index });
  }
  return parts.map((part) =>
    part.marked ? (
      <mark
        key={part.start}
        className="rounded-[.1em] bg-foreground/15 text-foreground [box-decoration-break:clone]"
      >
        {part.text}
      </mark>
    ) : (
      <span key={part.start}>{part.text}</span>
    ),
  );
}
