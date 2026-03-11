import fluentReactComponents from "@fluentui/react-components";

const { Body1, Caption1, Card, Title2 } = fluentReactComponents;
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
    <Card className="hero-grid__card">
      <Caption1 className="eyebrow">{label}</Caption1>
      <Title2 as="p" className="hero-figure">
        {currency ? formatCompactCurrency(value) : value.toLocaleString("ja-JP")}
      </Title2>
      <Body1 className="subtle-text">{detail}</Body1>
    </Card>
  );
}