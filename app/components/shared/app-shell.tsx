import { Badge, Body1, Button, Caption1, Subtitle2, Title2 } from "@fluentui/react-components";
import { Link } from "react-router";

import type { ReactNode } from "react";

type AuthenticatedUser = {
  email: string;
  name: string;
  objectId: string;
};

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
  user,
}: {
  children: ReactNode;
  pathname: string;
  user: AuthenticatedUser | null;
}) {
  return (
    <div className="app-shell">
      <div className="app-shell__inner">
        <aside className="sidebar">
          <div className="brand-block">
            <Badge appearance="filled" className="brand-mark">
              MyCRM
            </Badge>
            <Title2 as="h1" className="brand-title">
              営業オペレーション
            </Title2>
            <Body1 className="brand-copy">
              本部提案、導入余地、案件進行、活動履歴を同じ流れで確認できる業務画面です。
            </Body1>
          </div>

          <nav aria-label="主要ナビゲーション">
            {navigation.map((item) => (
              <Link
                key={item.to}
                className={`nav-link${isActive(pathname, item.to) ? " is-active" : ""}`}
                to={item.to}
              >
                <Subtitle2 as="span" className="nav-label">
                  {item.label}
                </Subtitle2>
                <Caption1 as="span" className="nav-description">
                  {item.description}
                </Caption1>
              </Link>
            ))}
          </nav>

          <div className="sidebar-footer">
            <Caption1 className="eyebrow">Operating model</Caption1>
            <Body1 className="supporting-copy">
              本部商談から店舗導入までを、条件と次アクション込みで一貫して追える構成にしています。
            </Body1>
            {user ? (
              <div className="sidebar-user-block">
                <div>
                  <Subtitle2 as="p" className="sidebar-user-name">
                    {user.name}
                  </Subtitle2>
                  <Caption1 as="p" className="sidebar-user-email">
                    {user.email}
                  </Caption1>
                </div>
                <Button appearance="subtle" as="a" href="/auth/logout" size="small">
                  ログアウト
                </Button>
              </div>
            ) : null}
          </div>
        </aside>

        <div className="content-area">{children}</div>
      </div>
    </div>
  );
}