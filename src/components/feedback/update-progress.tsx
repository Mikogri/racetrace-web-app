export function UpdateProgress({ className, label }: { className: string; label: string }) {
  return (
    <div className={className} role="progressbar" aria-label={label}>
      <span />
    </div>
  );
}
