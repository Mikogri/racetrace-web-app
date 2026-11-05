import { type CSSProperties } from "react";
import { getRatingTone } from "../../utils/rating";
import { Panel, PanelHeader } from "../ui/panel";
import styles from "./charts.module.css";

type RadarMetric = {
  label: string;
  value: number | null;
  display: string;
  score?: number;
};

const width = 620;
const height = 384;
const centerX = 310;
const centerY = 211;
const radius = 150;

function point(index: number, score: number) {
  const angle = ((-90 + index * 72) * Math.PI) / 180;
  const distance = (radius * Math.max(0, Math.min(score, 132))) / 100;
  return {
    x: centerX + Math.cos(angle) * distance,
    y: centerY + Math.sin(angle) * distance,
  };
}

function polygon(values: number[]) {
  return values
    .map((value, index) => {
      const coordinates = point(index, value);
      return `${coordinates.x.toFixed(2)},${coordinates.y.toFixed(2)}`;
    })
    .join(" ");
}

export function PerformanceRadar({
  metrics,
  title = "Performance overview",
  className,
  compact = false,
}: {
  metrics: RadarMetric[];
  title?: string;
  className?: string;
  compact?: boolean;
}) {
  const values = metrics.map((metric) => metric.score ?? metric.value ?? 0);

  return (
    <Panel
      bare
      padding="none"
      className={`${styles.chartPanel} ${styles.radarChart} ${compact ? styles.compact : ""} ${className ?? ""}`}
    >
      <div className={styles.heading}>
        <PanelHeader title={title} />
      </div>
      <div className={styles.radarLayout}>
        <div className={styles.radarCanvas}>
          <svg
            className={styles.radar}
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label="Rider performance overview"
          >
            {[25, 50, 75, 100].map((level) => (
              <polygon
                key={level}
                points={polygon(metrics.map(() => level))}
                className={styles.radarGrid}
              />
            ))}
            {metrics.map((metric, index) => {
              const axis = point(index, 100);
              return (
                <line
                  key={metric.label}
                  x1={centerX}
                  y1={centerY}
                  x2={axis.x}
                  y2={axis.y}
                  className={styles.radarAxis}
                />
              );
            })}
            <polygon points={polygon(values)} className={styles.radarValue} />
          </svg>
          <div className={styles.radarLabels} aria-hidden="true">
            {metrics.map((metric, index) => {
              const labelPoint = point(index, 132);
              return (
                <div
                  className={styles.radarLabelGroup}
                  key={metric.label}
                  style={
                    {
                      left: `${(labelPoint.x / width) * 100}%`,
                      top: `${(labelPoint.y / height) * 100}%`,
                    } as CSSProperties
                  }
                >
                  <span>{metric.label}</span>
                  <strong>{metric.display}</strong>
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.radarValues} aria-label="Performance values">
          {metrics.map((metric) => {
            const score = metric.score ?? metric.value;
            const tone =
              score === null ? styles.missing : styles[getRatingTone(score)];
            return (
              <div key={metric.label}>
                <span>{metric.label}</span>
                <strong className={tone}>{metric.display}</strong>
              </div>
            );
          })}
        </div>
      </div>
    </Panel>
  );
}
