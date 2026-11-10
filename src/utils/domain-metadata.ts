import { useSyncExternalStore } from "react";
import { z } from "zod";
import { registerCategoryMetadata } from "./categories";

const labelSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  shortName: z.string().min(1),
  displayOrder: z.number().int(),
  aliases: z.array(z.string()),
});

export const domainMetadataSchema = z.object({
  categories: z.array(
    labelSchema.extend({
      gender: z.enum(["male", "female", "open"]),
      minAge: z.number().int().nullable(),
      maxAge: z.number().int().nullable(),
    }),
  ),
  sessionTypes: z.array(
    labelSchema.extend({
      abbreviation: z.string().min(1),
      groupName: z.string().min(1),
    }),
  ),
  roundStatuses: z.array(labelSchema),
  sessionStatuses: z.array(labelSchema),
});

export type DomainMetadata = z.infer<typeof domainMetadataSchema>;
type SessionLabel =
  "name" | "shortName" | "abbreviation" | "groupName" | "code";

// Compatibility labels while metadata is loading or unavailable; API values win.
const fallbackSessions: DomainMetadata["sessionTypes"] = [
  {
    code: "seeding",
    name: "Seeding",
    shortName: "Seeding",
    abbreviation: "S",
    groupName: "Seeding",
    displayOrder: 1,
    aliases: ["S", "Seeding Run", "Seeding Round"],
  },
  {
    code: "qualifying",
    name: "Qualifying",
    shortName: "Quali",
    abbreviation: "Q",
    groupName: "Qualifying",
    displayOrder: 2,
    aliases: ["Q", "Quali", "Qualification"],
  },
  {
    code: "qualifying_1",
    name: "Qualifying 1",
    shortName: "Quali 1",
    abbreviation: "Q1",
    groupName: "Qualifying 1",
    displayOrder: 3,
    aliases: ["Q1", "Quali 1", "Qualification 1"],
  },
  {
    code: "qualifying_2",
    name: "Qualifying 2",
    shortName: "Quali 2",
    abbreviation: "Q2",
    groupName: "Qualifying 2",
    displayOrder: 4,
    aliases: ["Q2", "Quali 2", "Qualification 2"],
  },
  {
    code: "semi_final",
    name: "Semi Final",
    shortName: "Semi Final",
    abbreviation: "SF",
    groupName: "Semi Final",
    displayOrder: 5,
    aliases: ["SF", "Semi", "Semi-Finals"],
  },
  {
    code: "final",
    name: "Final",
    shortName: "Final",
    abbreviation: "F",
    groupName: "Finals",
    displayOrder: 6,
    aliases: ["F", "Finals", "Final Run"],
  },
  {
    code: "other",
    name: "Other",
    shortName: "Other",
    abbreviation: "O",
    groupName: "Other",
    displayOrder: 50,
    aliases: [],
  },
  {
    code: "timed_training",
    name: "Timed Training",
    shortName: "Timed Training",
    abbreviation: "O",
    groupName: "Timed Training",
    displayOrder: 50,
    aliases: [],
  },
  {
    code: "practice",
    name: "Practice",
    shortName: "Practice",
    abbreviation: "O",
    groupName: "Practice",
    displayOrder: 50,
    aliases: [],
  },
];
const initialMetadata: DomainMetadata = {
  categories: [],
  sessionTypes: fallbackSessions,
  roundStatuses: [],
  sessionStatuses: [],
};
let metadata = initialMetadata;
const listeners = new Set<() => void>();

export function applyDomainMetadata(next: DomainMetadata) {
  metadata = next;
  registerCategoryMetadata(next.categories);
  listeners.forEach((listener) => listener());
}

export function useDomainMetadata() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => metadata,
    () => initialMetadata,
  );
}

function key(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function findLabel<T extends { code: string; name: string; aliases: string[] }>(
  items: T[],
  value: string,
) {
  const normalized = key(value);
  return items.find(
    (item) =>
      key(item.code) === normalized ||
      key(item.name) === normalized ||
      item.aliases.some((alias) => key(alias) === normalized),
  );
}

function readable(value: string | null | undefined) {
  return (
    value
      ?.trim()
      .replace(/[_-]+/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase()) || "Unknown"
  );
}

export function formatSessionLabel(
  value: string | null | undefined,
  field: SessionLabel = "name",
  fallback?: string,
) {
  if (!value) return fallback || "Session";
  const item =
    findLabel(metadata.sessionTypes, value) ??
    findLabel(fallbackSessions, value);
  return item?.[field] || fallback || readable(value);
}

export function formatLiveSessionLabel(
  session: { sessionType: string | null; name: string },
  field: SessionLabel = "name",
) {
  const type = session.sessionType
    ? findLabel(metadata.sessionTypes, session.sessionType)
    : undefined;
  return type?.[field] || formatSessionLabel(session.name, field, session.name);
}

export function formatDomainLabel(
  domain: "roundStatuses" | "sessionStatuses",
  value: string | null | undefined,
  fallback?: string,
) {
  return (
    (value ? findLabel(metadata[domain], value)?.name : undefined) ||
    fallback ||
    readable(value)
  );
}
