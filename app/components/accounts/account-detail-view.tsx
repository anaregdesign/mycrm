import type { AccountDetail } from "~/lib/domain/entities/account";
import type { ProductCatalogItem } from "~/lib/domain/entities/product";
import { formatCompactCurrency, formatCurrency } from "~/lib/domain/value-objects/money";

import { PageHeader } from "../shared/page-header";
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
            <div>
              <p className="eyebrow">Contacts</p>
              <h2 className="section-title">意思決定者と推進役</h2>
            </div>
          </div>
          {detail.contacts.map((contact) => (
            <div className="list-card" key={contact.id}>
              <div className="list-card__top">
                <div>
                  <strong>{contact.name}</strong>
                  <p className="list-meta">{contact.role} / {contact.department}</p>
                </div>
                <span className="pill">{contact.influence}</span>
              </div>
            </div>
          ))}
        </article>

        <article className="panel stack">
          <div className="section-header">
            <div>
              <p className="eyebrow">Conditions</p>
              <h2 className="section-title">取引条件</h2>
            </div>
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
            <div>
              <p className="eyebrow">Whitespace</p>
              <h2 className="section-title">推奨提案商品</h2>
            </div>
          </div>
          {recommendedProducts.map((product) => (
            <div className="list-card" key={product.id}>
              <div className="list-card__top">
                <div>
                  <strong>{product.name}</strong>
                  <p className="list-meta">{product.category} / {product.temperatureZone}</p>
                </div>
                <span className="pill">{product.marginBand}</span>
              </div>
              <div className="chip-row">
                <span className="chip">賞味 {product.shelfLifeDays}日</span>
                <span className="chip">{product.packSize}</span>
              </div>
            </div>
          ))}
        </article>

        <article className="panel stack">
          <div className="section-header">
            <div>
              <p className="eyebrow">Sites</p>
              <h2 className="section-title">導入拠点</h2>
            </div>
          </div>
          {detail.sites.map((site) => (
            <div className="list-card" key={site.id}>
              <div className="list-card__top">
                <div>
                  <strong>{site.name}</strong>
                  <p className="list-meta">{site.prefecture} / {site.format}</p>
                </div>
                <span className="pill">{site.installedSkus} SKU</span>
              </div>
              <p className="subtle-text">月間想定数量 {site.monthlyVolume.toLocaleString("ja-JP")} ケース</p>
            </div>
          ))}
        </article>
      </section>

      <section className="two-column">
        <article className="panel stack">
          <div className="section-header">
            <div>
              <p className="eyebrow">Opportunities</p>
              <h2 className="section-title">進行中案件</h2>
            </div>
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
            <div>
              <p className="eyebrow">Activities</p>
              <h2 className="section-title">直近の活動</h2>
            </div>
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