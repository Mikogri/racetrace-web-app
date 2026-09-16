import { DetailsDisclosure } from "./details-disclosure";
import { getApiResponseMeta } from "../../lib/api-response-meta";
import styles from "./request-details.module.css";

type PayloadCounts = { objects: number; results: number; values: number };

function countPayload(value: unknown, parentKey = ""): PayloadCounts {
  if (Array.isArray(value)) {
    const nested = value.reduce<PayloadCounts>(
      (total, item) => {
        const counts = countPayload(item);
        return {
          objects: total.objects + counts.objects,
          results: total.results + counts.results,
          values: total.values + counts.values,
        };
      },
      { objects: 0, results: 0, values: 0 },
    );

    return {
      objects: nested.objects,
      results:
        nested.results +
        (/^(items|results)$/i.test(parentKey) ? value.length : 0),
      values: nested.values,
    };
  }

  if (typeof value === "object" && value !== null) {
    return Object.entries(value).reduce<PayloadCounts>(
      (total, [key, item]) => {
        const counts = countPayload(item, key);
        return {
          objects: total.objects + counts.objects,
          results: total.results + counts.results,
          values: total.values + counts.values,
        };
      },
      { objects: 1, results: 0, values: 0 },
    );
  }

  return { objects: 0, results: 0, values: 1 };
}

function getTotalItems(value: unknown, fallback: number) {
  if (
    typeof value === "object" &&
    value !== null &&
    "totalItems" in value &&
    typeof value.totalItems === "number"
  ) {
    return value.totalItems;
  }
  return fallback;
}

function formatInteger(value: number) {
  return Math.round(value).toLocaleString("en-US").replaceAll(",", " ");
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${formatInteger(bytes)} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(2)} MB`;
}

function formatDuration(durationMs: number) {
  const seconds = durationMs / 1_000;
  return `${seconds.toFixed(seconds < 10 ? 3 : 2)}s`;
}

export function RequestDetails({ data }: { data: unknown }) {
  const metadata = getApiResponseMeta(data);
  if (!metadata) return null;

  const counts = countPayload(data);
  const totalResults = getTotalItems(data, counts.results);

  return (
    <DetailsDisclosure title={`Request details - ${formatDuration(metadata.durationMs)}`} defaultExpanded>
          <div className={styles.data}>
            <span>
              {formatBytes(metadata.transferredBytes ?? metadata.responseBytes)} Response
            </span>
            <span>
              {formatInteger(counts.results)} / {formatInteger(totalResults)}{" "}
              Results
            </span>
            <span>{formatInteger(counts.objects)} Objects</span>
          </div>
    </DetailsDisclosure>
  );
}
