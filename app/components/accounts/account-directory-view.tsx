import { Badge, Field, Input, Select } from "@fluentui/react-components";
import { Link } from "react-router";

import type { AccountSummary } from "~/lib/domain/entities/account";
import { formatCompactCurrency } from "~/lib/domain/value-objects/money";

import { DataTable } from "../shared/data-table";
import { PageHeader } from "../shared/page-header";
import { SectionHeading } from "../shared/section-heading";
import { StatusPill } from "../shared/status-pill";

export function AccountDirectoryView({
  accounts,
  query,
  channel,
  onQueryChange,
  onChannelChange,
}: {
  accounts: AccountSummary[];
  query: string;
  channel: string;
  onQueryChange: (query: string) => void;
  onChannelChange: (channel: string) => void;
}) {
  return (
    <main className="page">
      <PageHeader
        eyebrow="Accounts"
        title="本部、卸、外食、EC まで取引先を一元化する"
        copy="販路、導入商品、次アクションを同じ粒度で確認できる取引先一覧です。"
      />

      <section className="panel stack">
        <div className="section-header">
          <SectionHeading
            eyebrow="Directory"
            info="取引先の販路、売上、現行商品、導入余地、次アクションを横断で比較できます。"
            title="取引先一覧を条件で絞り込む"
          />
        </div>
        <div className="toolbar">
          <Field className="field-label" label="キーワード">
            <Input
              className="text-input"
              onChange={(_, data) => onQueryChange(data.value)}
              placeholder="会社名、地域、現行商品で検索"
              value={query}
            />
          </Field>
          <Field className="field-label" label="チャネル">
            <Select
              className="select-input"
              onChange={(event) => onChannelChange(event.currentTarget.value)}
              value={channel}
            >
              <option value="all">すべて</option>
              <option value="retail">小売</option>
              <option value="wholesale">卸</option>
              <option value="foodservice">外食</option>
              <option value="ecommerce">EC</option>
            </Select>
          </Field>
          <div className="field-label">
            <span>検索結果</span>
            <div className="summary-list">
              <Badge className="pill">{accounts.length} 社</Badge>
            </div>
          </div>
        </div>

        <DataTable
          ariaLabel="取引先一覧"
          columns={[
            {
              key: "account",
              header: "取引先",
              renderCell: (account) => (
                <>
                  <Link className="link-strong" to={`/accounts/${account.id}`}>
                    {account.name}
                  </Link>
                  <p className="list-meta">{account.region} / {account.segment}</p>
                </>
              ),
            },
            {
              key: "channel",
              header: "販路",
              renderCell: (account) => (
                <div className="stack">
                  <Badge className="pill">{account.channel}</Badge>
                  <StatusPill label={account.health} />
                </div>
              ),
            },
            {
              key: "revenue",
              header: "売上",
              renderCell: (account) => formatCompactCurrency(account.annualRevenue),
            },
            {
              key: "currentProducts",
              header: "現行商品",
              renderCell: (account) => account.currentProductNames.join(" / "),
            },
            {
              key: "whitespace",
              header: "導入余地",
              renderCell: (account) => account.whitespaceProductNames.join(" / "),
            },
            {
              key: "nextAction",
              header: "次アクション",
              renderCell: (account) => account.nextAction,
            },
          ]}
          getRowId={(account) => account.id}
          items={accounts}
        />
      </section>
    </main>
  );
}