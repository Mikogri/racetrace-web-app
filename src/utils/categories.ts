import { useSyncExternalStore } from "react";

export type CategoryGender = "male" | "female" | "open";

export function juniorCategoryForAge(age: number | null | undefined, gender: string | null | undefined) {
  if (age == null || !Number.isFinite(age) || age <= 0 || age > 18) return null;
  const normalized = normalizeGender(gender);
  return normalized === "male" ? "junior_men" : normalized === "female" ? "junior_women" : null;
}

export type KnownCategory = {
  value: string;
  label: string;
  abbreviation: string;
  gender: CategoryGender;
};

const STORAGE_KEY = "racetrace:known-categories:v1";

// Compatibility defaults until the API supplies authoritative labels and order.
// Categories discovered only at runtime remain available after these entries.
const baseCategories: KnownCategory[] = [
  {
    value: "elite_men",
    label: "Elite Men",
    abbreviation: "EM",
    gender: "male",
  },
  {
    value: "elite_women",
    label: "Elite Women",
    abbreviation: "EW",
    gender: "female",
  },
  {
    value: "junior_men",
    label: "Junior Men",
    abbreviation: "JM",
    gender: "male",
  },
  {
    value: "junior_women",
    label: "Junior Women",
    abbreviation: "JW",
    gender: "female",
  },
];

const knownAliases: Record<string, string> = {
  em: "elite_men",
  me: "elite_men",
  elitemen: "elite_men",
  menelite: "elite_men",
  ew: "elite_women",
  we: "elite_women",
  elitewomen: "elite_women",
  womenelite: "elite_women",
  jm: "junior_men",
  mj: "junior_men",
  juniormen: "junior_men",
  menjunior: "junior_men",
  jw: "junior_women",
  wj: "junior_women",
  juniorwomen: "junior_women",
  womenjunior: "junior_women",
};

const listeners = new Set<() => void>();
let metadataAliases: Record<string, string> = {};
let authoritativeCodes = new Set<string>();
let categories = loadCategories();

function compact(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Synthetic Elite + Junior views belong only to round details.
export function isCombinedRoundCategory(value: string) {
  return ["openmen", "openwomen"].includes(compact(value));
}

function canonicalValue(value: string) {
  return metadataAliases[compact(value)] ?? knownAliases[compact(value)] ?? value.trim();
}

export function normalizeCategoryValue(value: string | null | undefined) {
  if (!value?.trim()) return null;
  return canonicalValue(value);
}

function titleCase(value: string) {
  return value
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function inferGender(
  ...values: Array<string | null | undefined>
): CategoryGender {
  const text = values.filter(Boolean).join(" ").toLowerCase();
  if (/\b(women|woman|female|girls?|dames?)\b/.test(text)) return "female";
  if (/\b(men|man|male|boys?|hommes?)\b/.test(text)) return "male";
  if (/\b(open|mixed|mixte|unisex)\b/.test(text)) return "open";
  return "open";
}

function normalizeGender(
  value: unknown,
  ...fallback: string[]
): CategoryGender {
  if (typeof value === "string") {
    const normalized = value.toLowerCase();
    if (["male", "men", "man", "m"].includes(normalized)) return "male";
    if (["female", "women", "woman", "f", "w"].includes(normalized))
      return "female";
    if (["open", "mixed", "unisex", "unknown"].includes(normalized))
      return "open";
  }
  return inferGender(...fallback);
}

function abbreviationFor(label: string) {
  const words = label.match(/[A-Za-z]+|\d+/g) ?? [];
  return words.length > 1
    ? words
        .map((word) => (/^\d+$/.test(word) ? word : word[0]))
        .join("")
        .toUpperCase()
    : label.slice(0, 4).toUpperCase();
}

function loadCategories(): KnownCategory[] {
  if (typeof window === "undefined") return baseCategories;
  try {
    const stored = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) ?? "[]",
    ) as unknown;
    if (!Array.isArray(stored)) return baseCategories;
    const extras = stored.filter(
      (item): item is KnownCategory =>
        typeof item === "object" &&
        item !== null &&
        "value" in item &&
        typeof item.value === "string" &&
        "label" in item &&
        typeof item.label === "string" &&
        "abbreviation" in item &&
        typeof item.abbreviation === "string" &&
        "gender" in item &&
        ["male", "female", "open"].includes(String(item.gender)),
    );
    return mergeCategories(baseCategories, extras);
  } catch {
    return baseCategories;
  }
}

function mergeCategories(initial: KnownCategory[], incoming: KnownCategory[]) {
  const result = [...initial];
  for (const item of incoming) {
    if (isCombinedRoundCategory(item.value)) continue;
    const index = result.findIndex(
      (current) =>
        canonicalValue(current.value) === canonicalValue(item.value) ||
        compact(current.label) === compact(item.label),
    );
    if (index >= 0)
      result[index] = { ...result[index], ...item, value: result[index].value };
    else result.push(item);
  }
  return result;
}

function saveAndNotify(next: KnownCategory[]) {
  categories = next.filter(item => !isCombinedRoundCategory(item.value));
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(categories.filter((category) => !baseCategories.some((base) => base.value === category.value))),
      );
    } catch {
      // The in-memory registry still works when browser storage is unavailable.
    }
  }
  listeners.forEach((listener) => listener());
}

function registerCategory(
  value: string,
  label?: string | null,
  gender?: unknown,
) {
  const trimmed = value.trim();
  if (!trimmed) return;
  const canonical = canonicalValue(trimmed);
  if (isCombinedRoundCategory(canonical)) return;
  if (authoritativeCodes.has(canonical)) return;
  const existing = categories.find((item) => item.value === canonical);
  if (existing && !label && gender === undefined) return;
  const base = baseCategories.find((item) => item.value === canonical);
  const resolvedLabel = base?.label ?? (label?.trim() || titleCase(trimmed));
  const next: KnownCategory = {
    value: canonical,
    label: resolvedLabel,
    abbreviation: base?.abbreviation ?? abbreviationFor(resolvedLabel),
    gender: base?.gender ?? normalizeGender(gender, resolvedLabel, trimmed),
  };
  const merged = mergeCategories(categories, [next]);
  if (JSON.stringify(merged) !== JSON.stringify(categories))
    saveAndNotify(merged);
}

export function registerCategoryMetadata(items: Array<{
  code: string;
  name: string;
  shortName: string;
  displayOrder: number;
  aliases: string[];
  gender: CategoryGender;
}>) {
  metadataAliases = Object.fromEntries(items.flatMap((item) =>
    [item.code, ...item.aliases].map((alias) => [compact(alias), item.code]),
  ));
  authoritativeCodes = new Set(items.map((item) => item.code));
  const authoritative = [...items]
    .sort((left, right) => left.displayOrder - right.displayOrder)
    .map((item): KnownCategory => ({
      value: item.code,
      label: item.name,
      abbreviation: item.shortName,
      gender: item.gender,
    }));
  const remaining = categories.filter((item) => !authoritativeCodes.has(canonicalValue(item.value)));
  saveAndNotify([...authoritative, ...remaining]);
}

function inspectCategoryValue(value: unknown) {
  if (typeof value === "string") {
    registerCategory(value);
    return;
  }
  if (!value || typeof value !== "object") return;
  const item = value as Record<string, unknown>;
  const code = [
    item.value,
    item.code,
    item.category,
    item.categoryCode,
    item.slug,
  ].find(
    (candidate): candidate is string =>
      typeof candidate === "string" && candidate.length > 0,
  );
  const name = [item.label, item.name, item.categoryName].find(
    (candidate): candidate is string =>
      typeof candidate === "string" && candidate.length > 0,
  );
  if (code || name)
    registerCategory(
      code ?? name!,
      name,
      item.gender ?? item.sex ?? item.categoryGender,
    );
}

export function observeCategoriesInApiPayload(payload: unknown) {
  const visited = new WeakSet<object>();
  const walk = (value: unknown, parentKey = "") => {
    if (!value || typeof value !== "object") return;
    if (visited.has(value)) return;
    visited.add(value);
    if (Array.isArray(value)) {
      if (/categories/i.test(parentKey)) value.forEach(inspectCategoryValue);
      value.forEach((item) => walk(item, parentKey));
      return;
    }
    for (const [key, child] of Object.entries(
      value as Record<string, unknown>,
    )) {
      if (/^(category|categoryCode|currentCategory)$/i.test(key))
        inspectCategoryValue(child);
      if (/^categories$/i.test(key)) {
        if (Array.isArray(child)) child.forEach(inspectCategoryValue);
        else inspectCategoryValue(child);
      }
      walk(child, key);
    }
  };
  walk(payload);
}

export function getKnownCategories() {
  return categories;
}

export function sortCategoryValues(values: string[]) {
  const unique = [...new Set(values)];
  const order = new Map(
    categories.map((category, index) => [category.value, index]),
  );
  return unique.sort((left, right) => {
    const leftOrder =
      order.get(canonicalValue(left)) ?? Number.MAX_SAFE_INTEGER;
    const rightOrder =
      order.get(canonicalValue(right)) ?? Number.MAX_SAFE_INTEGER;
    return leftOrder - rightOrder || left.localeCompare(right);
  });
}

export function useKnownCategories() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => categories,
    () => baseCategories,
  );
}

export function categoryMatchesGender(
  category: KnownCategory,
  riderGender: string | null | undefined,
) {
  if (!riderGender) return true;
  const gender = normalizeGender(riderGender);
  return category.gender === "open" || category.gender === gender;
}

export function formatCategoryAbbreviation(category: string) {
  const canonical = canonicalValue(category);
  return (
    categories.find(
      (item) => item.value === canonical || item.value === category,
    )?.abbreviation ?? abbreviationFor(titleCase(category))
  );
}

export function formatCategoryLabel(category: string | null | undefined) {
  if (!category) return "Category Unknown";
  const canonical = canonicalValue(category);
  return (
    categories.find(
      (item) => item.value === canonical || item.value === category,
    )?.label ?? titleCase(category)
  );
}
