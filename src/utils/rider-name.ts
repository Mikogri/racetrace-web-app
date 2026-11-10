/** Abbreviates a display name without changing its casing or spelling. */
export function abbreviateRiderName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  return parts.length < 2
    ? fullName
    : `${parts[0]?.charAt(0) ?? ""}. ${parts.slice(1).join(" ")}`;
}
