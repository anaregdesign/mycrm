export function toneFromHealth(value: string) {
  if (value === "healthy" || value === "done" || value === "won") {
    return "healthy";
  }
  if (value === "watch" || value === "proposal" || value === "pilot") {
    return "watch";
  }
  return "risk";
}

export function StatusPill({ label }: { label: string }) {
  return (
    <span className="status-pill" data-tone={toneFromHealth(label)}>
      {label}
    </span>
  );
}