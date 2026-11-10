import { RiderLink } from "../navigation/rider-navigation";
import type { RiderSummary as RiderSummaryType } from "../../types/domain";
import { CyclingText } from "./cycling-text";
import { normalizeDisplayName } from "../../utils/display-name";
import styles from "./rider-cell.module.css";

export function RiderCell({
  rider,
  compact = false,
  linked = true,
  cycling = false,
  showTeam = true,
}: {
  rider: RiderSummaryType;
  compact?: boolean;
  linked?: boolean;
  cycling?: boolean;
  showTeam?: boolean;
}) {
  const displayName = normalizeDisplayName(rider.name);
  const displayTeam = rider.team ? normalizeDisplayName(rider.team) : "--";
  const renderedName = cycling ? (
    <CyclingText value={displayName} />
  ) : (
    displayName
  );
  const name = linked ? (
    <RiderLink className={styles.name} riderId={rider.id}>
      {renderedName}
    </RiderLink>
  ) : (
    <span className={styles.name}>{renderedName}</span>
  );
  return (
    <span className={styles.rider}>
      {rider.profileImageUrl && !compact ? (
        <img className={styles.avatar} src={rider.profileImageUrl} alt="" />
      ) : null}
      <span className={styles.text}>
        <span className={styles.nameLine}>
          {name}
          {rider.country ? (
            <span className={styles.country}>
              ({cycling ? <CyclingText value={rider.country} /> : rider.country}
              )
            </span>
          ) : null}
        </span>
        {showTeam ? (
          <span className={styles.metadata}>
            {cycling ? <CyclingText value={displayTeam} /> : displayTeam}
          </span>
        ) : null}
      </span>
    </span>
  );
}

export function RiderSummary({ rider }: { rider: RiderSummaryType }) {
  return <RiderCell rider={rider} />;
}
