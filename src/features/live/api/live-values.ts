export function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

export function numberValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value.replace(",", "."));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function identifierValue(value: unknown) {
  return (
    stringValue(value) ??
    (typeof value === "number" && Number.isFinite(value) ? String(value) : null)
  );
}

export function displayCase(value: string | null) {
  if (!value || value !== value.toUpperCase()) return value;
  return value
    .toLocaleLowerCase()
    .replace(/(^|[\s'-])\p{L}/gu, (letter) => letter.toLocaleUpperCase());
}

export function chronoMilliseconds(value: unknown) {
  const parsed = numberValue(value);
  return parsed === null || parsed <= 0 ? null : parsed / 1_000;
}
