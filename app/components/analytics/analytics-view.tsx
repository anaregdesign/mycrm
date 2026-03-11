import { formatCompactCurrency } from "~/lib/domain/value-objects/money";

import { DataTable } from "../shared/data-table";
import { PageHeader } from "../shared/page-header";
import { SectionHeading } from "../shared/section-heading";

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
        copy="販路ごとの案件量と提案余地を、会議用の判断材料として整理します。"
      />

      <section className="two-column">
        <article className="panel stack">
          <div className="section-header">
            <SectionHeading
              eyebrow="Pipeline"
              info="チャネルごとの案件件数と月次見込を同時に見て、商談量と金額規模の偏りを確認できます。"
              title="チャネル別案件金額"
            />
          </div>
          <DataTable
            ariaLabel="チャネル別案件金額"
            columns={[
              {
                key: "channel",
                header: "チャネル",
                renderCell: (item) => item.channel,
              },
              {
                key: "count",
                header: "案件数",
                renderCell: (item) => item.count,
              },
              {
                key: "pipeline",
                header: "月次見込",
                renderCell: (item) => formatCompactCurrency(item.pipeline),
              },
            ]}
            getRowId={(item) => item.channel}
            items={analytics.channelPipeline}
          />
        </article>

        <article className="panel stack">
          <div className="section-header">
            <SectionHeading
              eyebrow="Health"
              info="直近活動、案件停滞、導入拡大量などを踏まえた健全性ラベルの件数です。"
              title="アカウント健全性"
            />
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
          <SectionHeading
            eyebrow="Whitespace"
            info="未導入先が多い商品を上位から確認できます。販路適合や賞味期限と合わせて提案優先度を決める用途です。"
            title="提案余地の多い商品"
          />
        </div>
        <DataTable
          ariaLabel="提案余地の多い商品"
          columns={[
            {
              key: "productName",
              header: "商品",
              renderCell: (item) => item.productName,
            },
            {
              key: "whitespaceAccounts",
              header: "導入余地のあるアカウント数",
              renderCell: (item) => item.whitespaceAccounts,
            },
          ]}
          getRowId={(item) => item.productName}
          items={analytics.whitespaceByProduct}
        />
      </section>
    </main>
  );
}