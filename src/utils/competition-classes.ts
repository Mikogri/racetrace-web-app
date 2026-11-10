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

export type CompetitionClassDisplay = {
  abbreviation?: string | null | undefined;
  code?: string | null | undefined;
  name?: string | null | undefined;
};

const neutralColors = {
  text: "var(--color-event-class-neutral-text)",
  border: "var(--color-event-class-neutral-border)",
  chart: "var(--color-event-class-neutral-text)",
};

const classColors = new Map<string, typeof neutralColors>([
  [
    "world_cup",
    {
      text: "var(--color-event-class-world-cup-text)",
      border: "var(--color-event-class-world-cup-border)",
      chart: "var(--color-rating-top)",
    },
  ],
  [
    "world_championship",
    {
      text: "var(--color-event-class-world-championship-text)",
      border: "var(--color-event-class-world-championship-border)",
      chart: "var(--color-event-class-world-championship-text)",
    },
  ],
]);

const classAliases = new Map([
  ["wc", "world_cup"],
  ["wch", "world_championship"],
  ["world_championships", "world_championship"],
]);

export function getCompetitionClassColors({
  code,
  abbreviation,
  name,
}: CompetitionClassDisplay) {
  for (const value of [code, abbreviation, name]) {
    const key =
      value
        ?.trim()
        .toLowerCase()
        .replace(/[\s-]+/g, "_") ?? "";
    const colors = classColors.get(classAliases.get(key) ?? key);
    if (colors) return colors;
  }
  return neutralColors;
}

export function formatCompetitionClassAbbreviation({
  abbreviation,
  code,
  name,
}: CompetitionClassDisplay) {
  const apiValue = abbreviation?.trim();
  if (apiValue) return apiValue.toUpperCase();
  return abbreviationFromCode(code?.trim() || name?.trim() || "");
}
