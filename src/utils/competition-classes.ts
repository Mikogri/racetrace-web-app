function abbreviationFromCode(value: string) {
  const words = value
    .trim()
    .split(/[^a-z0-9]+/i)
    .filter(Boolean);
  if (words.length === 0) return "--";
  if (words.length === 1) return words[0].slice(0, 4).toUpperCase();
  return words
    .map((word, index) =>
      index > 0 && word.length > 3 ? word.slice(0, 2) : word.slice(0, 1),
    )
    .join("")
    .slice(0, 4)
    .toUpperCase();
}

export function formatCompetitionClassAbbreviation({
  abbreviation,
  code,
  name,
}: {
  abbreviation?: string | null | undefined;
  code?: string | null | undefined;
  name?: string | null | undefined;
}) {
  const apiValue = abbreviation?.trim();
  if (apiValue) return apiValue.toUpperCase();
  return abbreviationFromCode(code?.trim() || name?.trim() || "");
}
