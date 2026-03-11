import { Link } from "react-router";

import type { ReactNode } from "react";

const navigation = [
  {
    to: "/",
    label: "ダッシュボード",
    description: "販路別 KPI とホワイトスペース",
  },
  {
    to: "/accounts",
    label: "アカウント",
    description: "法人・拠点・担当者・取引条件",
  },
  {
    to: "/opportunities",
    label: "案件",
    description: "導入提案、採用確度、次アクション",
  },
  {
    to: "/activities",
    label: "活動",
    description: "訪問、試食会、見積、フォロー",
  },
  {
    to: "/products",
    label: "商品提案",
    description: "温度帯、賞味期限、販路適合",
  },
  {
    to: "/analytics",
    label: "分析",
    description: "チャネル別採算と失注傾向",
  },
];

function isActive(pathname: string, target: string) {
  if (target === "/") {
    return pathname === "/";
  }

  return pathname === target || pathname.startsWith(`${target}/`);
}

export function AppShell({
  children,
  pathname,
}: {
  children: ReactNode;
  pathname: string;
}) {
  return (
    <div className="app-shell">
      <div className="app-shell__inner">
        <aside className="sidebar">
          <div className="brand-mark">CRM</div>
          <h1 className="brand-title">MyCRM</h1>
          <p className="brand-copy">
            食品営業の本部提案、卸深耕、店舗導入、販促条件をひとつの業務画面に集約します。
          </p>

          <nav>
            {navigation.map((item) => (
              <Link
                key={item.to}
                className={`nav-link${isActive(pathname, item.to) ? " is-active" : ""}`}
                to={item.to}
              >
                <span className="nav-label">{item.label}</span>
                <span className="nav-description">{item.description}</span>
              </Link>
            ))}
          </nav>

          <div className="sidebar-footer">
            <p className="eyebrow">Operating Model</p>
            <p className="supporting-copy">
              本部商談、店舗導入、販促投資、採算条件まで一続きに扱う営業運用を想定しています。
            </p>
          </div>
        </aside>

        <div className="content-area">{children}</div>
      </div>
    </div>
  );
}