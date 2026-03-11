import { Badge } from "@fluentui/react-components";

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
  const tone = toneFromHealth(label);

  return (
    <Badge className={`status-pill status-pill--${tone}`}>
      {label}
    </Badge>
  );
}