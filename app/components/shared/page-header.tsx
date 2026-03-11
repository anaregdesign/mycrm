import { Badge, Body1, Title1 } from "@fluentui/react-components";
import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  copy,
  aside,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  aside?: ReactNode;
}) {
  return (
    <header className="page-header">
      <div className="page-header__top">
        <div className="page-header__content">
          <Badge appearance="outline" className="eyebrow">
            {eyebrow}
          </Badge>
          <Title1 as="h1" className="page-title">
            {title}
          </Title1>
          <Body1 className="page-copy">{copy}</Body1>
        </div>
        {aside ? <div className="page-header__aside">{aside}</div> : null}
      </div>
    </header>
  );
}