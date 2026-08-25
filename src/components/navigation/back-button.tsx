import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { getRiderNavigationState } from "./rider-navigation-state";
import styles from "./back-button.module.css";

export function BackButton({
  fallback,
  useHistoryFallback = true,
}: {
  fallback: string;
  useHistoryFallback?: boolean;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => {
    const returnTo = getRiderNavigationState(location.state)?.returnTo;
    if (returnTo) {
      navigate(returnTo);
      return;
    }
    const historyIndex = window.history.state?.idx;
    if (
      useHistoryFallback &&
      typeof historyIndex === "number" &&
      historyIndex > 0
    )
      navigate(-1);
    else navigate(fallback);
  };

  return (
    <Button className={styles.backButton} variant="ghost" onClick={goBack}>
      <svg className={styles.backIcon} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M10 5 3 12l7 7M4 12h17" />
      </svg>
      <span>Back</span>
    </Button>
  );
}
