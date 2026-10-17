import type { RoundProfile } from "../../features/analytics/api/get-round-profile";
import { formatCompetitionClassAbbreviation } from "../../utils/competition-classes";

export const classCode = (round: RoundProfile["round"] | undefined) =>
  formatCompetitionClassAbbreviation({
    abbreviation: round?.competitionClassAbbreviation,
    code: round?.competitionClassCode,
    name: round?.competitionClassName,
  });
