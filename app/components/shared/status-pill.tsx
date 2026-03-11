import fluentReactComponents from "@fluentui/react-components";

const { Badge } = fluentReactComponents;

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