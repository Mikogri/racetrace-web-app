import { LightRays } from "../backgrounds/light-rays";
import styles from "./page-backdrop.module.css";

/** Decorative page background: neutral white light from the top that ignores the pointer, over a faint grid. */
export function PageBackdrop() {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <LightRays
        className={styles.light}
        raysColor="#ffffff"
        lightSpread={0.85}
        rayLength={1.2}
        intensity={0.65}
        glow={0.3}
        haze={0.2}
        atmosphere={0}
        saturation={0}
        raysSpeed={0.3}
        followMouse={false}
        cursorShadow={false}
        clickPulse={false}
        opacity={0.8}
      />
      <span className={styles.grid} />
    </div>
  );
}
