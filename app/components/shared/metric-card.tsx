import { formatCompactCurrency } from "~/lib/domain/value-objects/money";

export function MetricCard({
  label,
  value,
  detail,
  currency = false,
}: {
  label: string;
  value: number;
  detail: string;
  currency?: boolean;
}) {
  return (
    <article className="hero-grid__card">
      <p className="eyebrow">{label}</p>
      <p className="hero-figure">{currency ? formatCompactCurrency(value) : value.toLocaleString("ja-JP")}</p>
      <p className="subtle-text">{detail}</p>
    </article>
  );
}