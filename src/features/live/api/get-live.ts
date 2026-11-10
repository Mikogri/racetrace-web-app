// Compatibility facade for live pages, result tables, and API contract consumers.
export {
  liveSessionRawSchema,
  sessionResultSchema,
  sessionSummarySchema,
  sessionResultsSchema,
} from "./live-models";
export type {
  LiveSession,
  LiveRound,
  SessionResults,
  LiveCoursePoint,
  LiveCourseRider,
  LiveTimingSummary,
  SessionResultsWireContract,
} from "./live-models";
export {
  isLiveRoundStatus,
  discoverChronoRaceSessions,
  resolveChronoRaceSessionStatus,
  resolveChronoRaceJsonUrl,
} from "./chronorace-provider";
export { normalizeTissotLivePayload } from "./tissot-provider";
export {
  liveTimingPresentation,
  normalizeChronoRacePayload,
} from "./live-normalization";
export {
  useLiveRound,
  useChronoRaceCatalog,
  useResolvedLiveRiderIds,
  chronoRaceSessionSnapshotOptions,
  useChronoRaceSessionSnapshot,
  useChronoRaceSessionResults,
} from "./live-hooks";
