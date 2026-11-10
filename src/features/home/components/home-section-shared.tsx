import type { RiderSummary } from "../../../types/domain";
import { RiderCell } from "../../../components/data-display/rider-cell";
import styles from "../../../components/analytics/home-sections.module.css";

export function Scaffold({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={`${styles.scaffold} ${compact ? styles.scaffoldCompact : ""}`}
      aria-hidden="true"
    />
  );
}

export function TableFallbackRows({
  columns,
  loading,
  rows = 5,
}: {
  columns: number;
  loading: boolean;
  rows?: number;
}) {
  return (
    <>
      {Array.from({ length: loading ? rows : 1 }, (_, rowIndex) => (
        <tr key={rowIndex}>
          {Array.from({ length: columns }, (_, columnIndex) => (
            <td key={columnIndex}>{loading ? <Scaffold compact /> : "--"}</td>
          ))}
        </tr>
      ))}
    </>
  );
}

function rider(row: {
  riderId: string;
  fullName: string;
  teamName: string | null;
  countryCode: string | null;
}): RiderSummary {
  return {
    id: row.riderId,
    name: row.fullName,
    team: row.teamName,
    country: row.countryCode,
    category: null,
    profileImageUrl: null,
  };
}

export function HomeRiderCell({ row }: { row: Parameters<typeof rider>[0] }) {
  return <RiderCell rider={rider(row)} compact />;
}
