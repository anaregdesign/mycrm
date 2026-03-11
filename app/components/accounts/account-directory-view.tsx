import { Badge, Field, Input, Select } from "@fluentui/react-components";
import { Link } from "react-router";

import type { AccountSummary } from "~/lib/domain/entities/account";
import { formatCompactCurrency } from "~/lib/domain/value-objects/money";

import { PageHeader } from "../shared/page-header";
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
        copy="法人単位だけでなく、販路、拠点、次アクション、導入商品、取引条件の前提を営業が同じ粒度で見られる状態を作ります。"
      />

      <section className="panel stack">
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

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>取引先</th>
                <th>販路</th>
                <th>売上</th>
                <th>現行商品</th>
                <th>導入余地</th>
                <th>次アクション</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.id}>
                  <td>
                    <Link className="link-strong" to={`/accounts/${account.id}`}>
                      {account.name}
                    </Link>
                    <p className="list-meta">{account.region} / {account.segment}</p>
                  </td>
                  <td>
                    <div className="stack">
                      <Badge className="pill">{account.channel}</Badge>
                      <StatusPill label={account.health} />
                    </div>
                  </td>
                  <td>{formatCompactCurrency(account.annualRevenue)}</td>
                  <td>{account.currentProductNames.join(" / ")}</td>
                  <td>{account.whitespaceProductNames.join(" / ")}</td>
                  <td>{account.nextAction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}