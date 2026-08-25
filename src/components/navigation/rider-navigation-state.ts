import { useLocation } from "react-router-dom";
import { routes } from "../../config/routes";

export type RiderNavigationState = {
  returnTo: string;
  sourceSection: string;
};

export function sectionForPath(pathname: string) {
  if (pathname === routes.home || pathname.startsWith("/home/"))
    return routes.home;
  if (pathname.startsWith(routes.ranking)) return routes.ranking;
  if (pathname.startsWith(routes.results) || pathname.startsWith("/rounds"))
    return routes.results;
  if (pathname.startsWith(routes.live)) return routes.live;
  if (pathname.startsWith(routes.compare)) return routes.compare;
  if (pathname.startsWith(routes.about)) return routes.about;
  return null;
}

function detailPrefix(section: string) {
  return section === routes.home ? "/home" : section;
}

export function riderPathForLocation(pathname: string, riderId: string) {
  const section = sectionForPath(pathname);
  return section
    ? `${detailPrefix(section)}/riders/${encodeURIComponent(riderId)}`
    : routes.rider(riderId);
}

export function riderBasePath(pathname: string, riderId: string) {
  const suffix = `/riders/${encodeURIComponent(riderId)}`;
  const index = pathname.indexOf(suffix);
  return index >= 0 ? pathname.slice(0, index + suffix.length) : routes.rider(riderId);
}

export function getRiderNavigationState(
  state: unknown,
): RiderNavigationState | null {
  if (!state || typeof state !== "object") return null;
  const candidate = state as Partial<RiderNavigationState>;
  return typeof candidate.returnTo === "string" &&
    typeof candidate.sourceSection === "string"
    ? { returnTo: candidate.returnTo, sourceSection: candidate.sourceSection }
    : null;
}

export function isNavigationSectionActive(
  pathname: string,
  itemPath: string,
  riderSourceSection?: string | null,
) {
  const contextualSection = sectionForPath(pathname);
  const isDetailPath =
    pathname.includes("/riders/") || pathname.startsWith("/results/rounds/");
  if (isDetailPath && contextualSection)
    return contextualSection === itemPath;
  if (isDetailPath && riderSourceSection)
    return riderSourceSection === itemPath;
  return itemPath === routes.home
    ? pathname === routes.home
    : pathname === itemPath || pathname.startsWith(`${itemPath}/`);
}

export function useRiderNavigationState() {
  const location = useLocation();
  const existingState = getRiderNavigationState(location.state);

  if (location.pathname.startsWith("/riders/")) return existingState;

  if (existingState) {
    return {
      returnTo: `${location.pathname}${location.search}${location.hash}`,
      sourceSection: existingState.sourceSection,
    } satisfies RiderNavigationState;
  }

  const sourceSection = sectionForPath(location.pathname);
  if (!sourceSection) return null;

  return {
    returnTo: `${location.pathname}${location.search}${location.hash}`,
    sourceSection,
  } satisfies RiderNavigationState;
}
