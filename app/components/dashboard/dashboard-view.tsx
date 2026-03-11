import { Badge, Field, Input, Select } from "@fluentui/react-components";
import { Link } from "react-router";

import type { AccountSummary } from "~/lib/domain/entities/account";
import type { DashboardData } from "~/lib/server/usecase/load-dashboard.server";
import { formatCompactCurrency } from "~/lib/domain/value-objects/money";

import { MetricCard } from "../shared/metric-card";
import { PageHeader } from "../shared/page-header";
import { SectionHeading } from "../shared/section-heading";
import { StatusPill } from "../shared/status-pill";

export function DashboardView({
  data,
  channel,
  query,
  onChannelChange,
  onQueryChange,
  atRiskAccounts,
  whitespaceAccounts,
}: {
  data: DashboardData;
  channel: string;
  query: string;
  onChannelChange: (channel: string) => void;
  onQueryChange: (query: string) => void;
  atRiskAccounts: AccountSummary[];
  whitespaceAccounts: AccountSummary[];
}) {
  return (
    <main className="page">
      <PageHeader
        eyebrow="Revenue Command"
        title="販路ごとの採用確率と余地をまとめて判断する"
        copy="導入余地と案件進行を同じ視点で確認し、次の打ち手を更新します。"
        aside={<p className="table-caption">As of {data.asOf}</p>}
      />

      <section className="hero-grid">
        {data.metrics.map((metric) => (
          <MetricCard
            key={metric.label}
            currency={metric.label === "月次パイプライン"}
            detail={metric.detail}
            label={metric.label}
            value={metric.value}
          />
        ))}
      </section>

      <section className="panel stack">
        <div className="section-header">
          <SectionHeading
            eyebrow="Focus Filters"
            info="キーワード検索は取引先名、地域、導入余地商品を対象にしています。ステージ件数は当日の対象範囲で集計しています。"
            title="チャネルと対象先で注力先を絞り込む"
          />
        </div>
        <div className="toolbar">
          <Field className="field-label" label="キーワード">
            <Input
              className="text-input"
              onChange={(_, data) => onQueryChange(data.value)}
              placeholder="取引先名、地域、導入余地商品で検索"
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
            <span>主要ステージ</span>
            <div className="filter-row">
              {data.stageSummary.map((stage) => (
                <Badge className="filter-pill" key={stage.stage}>
                  {stage.stage} {stage.count}件
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="channel-grid">
        {data.channels.map((item) => (
          <article className="panel" key={item.channel}>
            <p className="eyebrow">{item.channel}</p>
            <p className="metric-card__value">{formatCompactCurrency(item.pipeline)}</p>
            <p className="subtle-text">
              {item.accountCount} 社 / 導入余地 {item.whitespaceCount} SKU
            </p>
          </article>
        ))}
      </section>

      <section className="two-column">
        <article className="panel stack">
          <div className="section-header">
            <SectionHeading
              eyebrow="At Risk"
              info="健全性が下がっている取引先を優先表示しています。価格条件、採用品切り替え、活動停滞の見直し対象を想定しています。"
              title="条件調整または再提案が必要な取引先"
            />
          </div>
          <div className="list-grid">
            {atRiskAccounts.map((account) => (
              <Link className="list-card" key={account.id} to={`/accounts/${account.id}`}>
                <div className="list-card__top">
                  <div>
                    <strong>{account.name}</strong>
                    <p className="list-meta">{account.region} / {account.segment}</p>
                  </div>
                  <StatusPill label={account.health} />
                </div>
                <p className="subtle-text">{account.nextAction}</p>
              </Link>
            ))}
          </div>
        </article>

        <article className="panel stack">
          <div className="section-header">
            <SectionHeading
              eyebrow="Whitespace"
              info="未導入 SKU が多い取引先を表示しています。販路適合と導入余地の両方を見て提案順を決める想定です。"
              title="導入余地の大きいアカウント"
            />
          </div>
          <div className="list-grid">
            {whitespaceAccounts.map((account) => (
              <Link className="list-card" key={account.id} to={`/accounts/${account.id}`}>
                <div className="list-card__top">
                  <div>
                    <strong>{account.name}</strong>
                    <p className="list-meta">不足 SKU {account.whitespaceProductNames.length}</p>
                  </div>
                  <Badge className="pill">{account.channel}</Badge>
                </div>
                <div className="chip-row">
                  {account.whitespaceProductNames.map((name) => (
                    <Badge className="chip" key={name}>
                      {name}
                    </Badge>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}