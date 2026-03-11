import { Badge } from "@fluentui/react-components";
import type { AccountDetail } from "~/lib/domain/entities/account";
import type { ProductCatalogItem } from "~/lib/domain/entities/product";
import { formatCompactCurrency, formatCurrency } from "~/lib/domain/value-objects/money";

import { SectionHeading } from "../shared/section-heading";
import { StatusPill } from "../shared/status-pill";

export function AccountDetailView({
  detail,
  recommendedProducts,
}: {
  detail: AccountDetail;
  recommendedProducts: ProductCatalogItem[];
}) {
  return (
    <main className="page">
      <div className="detail-hero">
        <div className="page-header__top">
          <div>
            <p className="eyebrow">Account 360</p>
            <h1 className="detail-title">{detail.name}</h1>
            <p className="detail-summary">{detail.summary}</p>
          </div>
          <StatusPill label={detail.health} />
        </div>

        <div className="detail-meta-grid">
          <div className="summary-tile">
            年間売上
            <strong>{formatCompactCurrency(detail.annualRevenue)}</strong>
          </div>
          <div className="summary-tile">
            最終接点
            <strong>{detail.lastContactAt}</strong>
          </div>
          <div className="summary-tile">
            次アクション
            <strong>{detail.nextAction}</strong>
          </div>
        </div>
      </div>

      <section className="detail-grid">
        <article className="panel stack">
          <div className="section-header">
            <SectionHeading
              eyebrow="Contacts"
              info="意思決定者、推進役、現場影響者を同時に確認するための一覧です。部門と影響度の組み合わせで商談準備に使います。"
              title="意思決定者と推進役"
            />
          </div>
          {detail.contacts.map((contact) => (
            <div className="list-card" key={contact.id}>
              <div className="list-card__top">
                <div>
                  <strong>{contact.name}</strong>
                  <p className="list-meta">{contact.role} / {contact.department}</p>
                </div>
                <Badge className="pill">{contact.influence}</Badge>
              </div>
            </div>
          ))}
        </article>

        <article className="panel stack">
          <div className="section-header">
            <SectionHeading
              eyebrow="Conditions"
              info="支払条件、最低受注、リベート、物流条件をまとめています。提案条件や採算調整の前提として参照する想定です。"
              title="取引条件"
            />
          </div>
          <div className="summary-grid">
            <div className="summary-tile">支払条件<strong>{detail.salesCondition.paymentTerms}</strong></div>
            <div className="summary-tile">最低受注<strong>{formatCurrency(detail.salesCondition.minimumOrderValue)}</strong></div>
            <div className="summary-tile">リベート<strong>{detail.salesCondition.rebateRate}%</strong></div>
            <div className="summary-tile">リードタイム<strong>{detail.salesCondition.leadTimeDays}日</strong></div>
            <div className="summary-tile">物流<strong>{detail.salesCondition.logisticsMode}</strong></div>
            <div className="summary-tile">販促協賛<strong>{detail.salesCondition.promotionBudgetRatio}%</strong></div>
          </div>
        </article>
      </section>

      <section className="two-column">
        <article className="panel stack">
          <div className="section-header">
            <SectionHeading
              eyebrow="Whitespace"
              info="販路適合と未導入余地をもとに、追加提案候補を表示しています。温度帯や賞味期限も同時に確認できます。"
              title="推奨提案商品"
            />
          </div>
          {recommendedProducts.map((product) => (
            <div className="list-card" key={product.id}>
              <div className="list-card__top">
                <div>
                  <strong>{product.name}</strong>
                  <p className="list-meta">{product.category} / {product.temperatureZone}</p>
                </div>
                <Badge className="pill">{product.marginBand}</Badge>
              </div>
              <div className="chip-row">
                <Badge className="chip">賞味 {product.shelfLifeDays}日</Badge>
                <Badge className="chip">{product.packSize}</Badge>
              </div>
            </div>
          ))}
        </article>

        <article className="panel stack">
          <div className="section-header">
            <SectionHeading
              eyebrow="Sites"
              info="導入済み拠点の業態、SKU 数、想定数量を並べています。展開余地や補充提案の判断に使います。"
              title="導入拠点"
            />
          </div>
          {detail.sites.map((site) => (
            <div className="list-card" key={site.id}>
              <div className="list-card__top">
                <div>
                  <strong>{site.name}</strong>
                  <p className="list-meta">{site.prefecture} / {site.format}</p>
                </div>
                <Badge className="pill">{site.installedSkus} SKU</Badge>
              </div>
              <p className="subtle-text">月間想定数量 {site.monthlyVolume.toLocaleString("ja-JP")} ケース</p>
            </div>
          ))}
        </article>
      </section>

      <section className="two-column">
        <article className="panel stack">
          <div className="section-header">
            <SectionHeading
              eyebrow="Opportunities"
              info="この取引先で進行中の案件です。担当者、見込み時期、次アクションを確認できます。"
              title="進行中案件"
            />
          </div>
          {detail.opportunities.map((opportunity) => (
            <div className="list-card" key={opportunity.id}>
              <div className="list-card__top">
                <div>
                  <strong>{opportunity.title}</strong>
                  <p className="list-meta">{opportunity.targetCloseMonth} / {opportunity.owner}</p>
                </div>
                <StatusPill label={opportunity.stage} />
              </div>
              <p className="subtle-text">{opportunity.nextStep}</p>
            </div>
          ))}
        </article>

        <article className="panel stack">
          <div className="section-header">
            <SectionHeading
              eyebrow="Activities"
              info="直近の接点を時系列で表示しています。案件停滞の有無や次回接点の準備状況を確認する用途です。"
              title="直近の活動"
            />
          </div>
          <div className="timeline">
            {detail.recentActivities.map((activity) => (
              <div className="timeline-item" key={activity.id}>
                <div className="timeline-date">{activity.scheduledFor}</div>
                <div className="list-card">
                  <div className="list-card__top">
                    <div>
                      <strong>{activity.subject}</strong>
                      <p className="list-meta">{activity.owner} / {activity.type}</p>
                    </div>
                    <StatusPill label={activity.status} />
                  </div>
                  <p className="subtle-text">{activity.notes}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}