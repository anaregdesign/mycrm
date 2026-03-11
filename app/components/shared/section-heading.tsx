import { Badge, Button, Subtitle2, Tooltip } from "@fluentui/react-components";
import { Info16Regular } from "@fluentui/react-icons";

export function SectionHeading({
  eyebrow,
  title,
  info,
}: {
  eyebrow: string;
  title: string;
  info?: string;
}) {
  return (
    <div className="section-heading">
      <Badge appearance="outline" className="eyebrow">
        {eyebrow}
      </Badge>
      <div className="section-title-row">
        <Subtitle2 as="h2" className="section-title">
          {title}
        </Subtitle2>
        {info ? (
          <Tooltip content={info} relationship="description">
            <Button
              appearance="subtle"
              aria-label={`${title} の補足情報`}
              className="section-info-trigger"
              icon={<Info16Regular />}
              size="small"
            />
          </Tooltip>
        ) : null}
      </div>
    </div>
  );
}