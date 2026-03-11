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
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="page-title">{title}</h1>
          <p className="page-copy">{copy}</p>
        </div>
        {aside}
      </div>
    </header>
  );
}