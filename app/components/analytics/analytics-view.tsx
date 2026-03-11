import { formatCompactCurrency } from "~/lib/domain/value-objects/money";

import { PageHeader } from "../shared/page-header";

export function AnalyticsView({
  analytics,
}: {
  analytics: {
    channelPipeline: Array<{ channel: string; pipeline: number; count: number }>;
    healthDistribution: Array<{ health: string; count: number }>;
    whitespaceByProduct: Array<{ productName: string; whitespaceAccounts: number }>;
  };
}) {
  return (
    <main className="page">
      <PageHeader
        eyebrow="Analytics"
        title="販路別の採用余地とアカウント健全性を横断分析する"
        copy="営業会議で必要なのは単なる売上一覧ではなく、どの販路にどの SKU をどう通すかという再現可能な判断材料です。"
      />

      <section className="two-column">
        <article className="panel stack">
          <div className="section-header">
            <div>
              <p className="eyebrow">Pipeline</p>
              <h2 className="section-title">チャネル別案件金額</h2>
            </div>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>チャネル</th>
                  <th>案件数</th>
                  <th>月次見込</th>
                </tr>
              </thead>
              <tbody>
                {analytics.channelPipeline.map((item) => (
                  <tr key={item.channel}>
                    <td>{item.channel}</td>
                    <td>{item.count}</td>
                    <td>{formatCompactCurrency(item.pipeline)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="panel stack">
          <div className="section-header">
            <div>
              <p className="eyebrow">Health</p>
              <h2 className="section-title">アカウント健全性</h2>
            </div>
          </div>
          <div className="tile-grid">
            {analytics.healthDistribution.map((item) => (
              <div className="summary-tile" key={item.health}>
                {item.health}
                <strong>{item.count}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="panel stack">
        <div className="section-header">
          <div>
            <p className="eyebrow">Whitespace</p>
            <h2 className="section-title">提案余地の多い商品</h2>
          </div>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>商品</th>
                <th>導入余地のあるアカウント数</th>
              </tr>
            </thead>
            <tbody>
              {analytics.whitespaceByProduct.map((item) => (
                <tr key={item.productName}>
                  <td>{item.productName}</td>
                  <td>{item.whitespaceAccounts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}