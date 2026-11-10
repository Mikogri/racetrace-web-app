import type { RiderSummary } from "../../../types/domain";
import { formatCategoryLabel } from "../../../utils/categories";
import { formatCountryName } from "../../../utils/countries";
import riderBlue from "../../../assets/riders/rider-blue.png";
import riderGreen from "../../../assets/riders/rider-green.png";
import switchIcon from "../../../assets/icons/switch.png";
import { TableFeedbackState } from "../../../components/feedback/states";
import { normalizeDisplayName } from "../../../utils/display-name";
import { RiderLink } from "../../../components/navigation/rider-navigation";
import type { CompareRider } from "../api/get-compare";
import styles from "./compare-rider-hero.module.css";

export function CompareRiderHero({
  slot,
  rider,
  details,
  selectedCategory,
  onSelect,
}: {
  slot: "a" | "b";
  rider: RiderSummary | null;
  details: CompareRider | undefined;
  selectedCategory: string;
  onSelect: () => void;
}) {
  if (!rider) {
    return (
      <article className={`${styles.card} ${styles.empty}`}>
        <TableFeedbackState
          type="empty"
          compact
          animate={false}
          label="No Rider In Comparison"
          description="Select a rider to start the comparison."
          action={
            <button
              type="button"
              className={styles.selectButton}
              onClick={onSelect}
            >
              <span>Select Rider</span>
              <svg
                className={styles.selectArrow}
                viewBox="0 0 16 16"
                aria-hidden="true"
              >
                <path d="M2.5 8h10M8.5 3.75 12.75 8 8.5 12.25" />
              </svg>
            </button>
          }
        />
      </article>
    );
  }

  const name = normalizeDisplayName(details?.fullName ?? rider.name);
  const team = normalizeDisplayName(details?.teamName ?? rider.team ?? "--");
  const category = formatCategoryLabel(selectedCategory);
  const country = formatCountryName(details?.countryCode ?? rider.country);
  const image = slot === "a" ? riderGreen : riderBlue;

  return (
    <article
      className={`${styles.card} ${slot === "a" ? styles.riderA : styles.riderB}`}
    >
      <div className={styles.visual}>
        <button
          type="button"
          className={styles.changeButton}
          aria-label={`Change ${name}`}
          onClick={onSelect}
        >
          <img src={switchIcon} alt="" aria-hidden="true" />
        </button>
        <img src={image} alt="" />
      </div>
      <div className={styles.about}>
        <h2>
          <RiderLink className={styles.riderName} riderId={rider.id}>
            {name}
          </RiderLink>
        </h2>
        <div className={styles.team}>
          <span title={team}>{team}</span>
          {details?.teamCode ? <strong>{details.teamCode}</strong> : null}
        </div>
        <p>
          <span>{category}</span>
          {details?.age != null ? (
            <>
              <i>//</i>
              <span>{details.age} y.o</span>
            </>
          ) : null}
          <i>//</i>
          <span>{country}</span>
        </p>
      </div>
    </article>
  );
}
