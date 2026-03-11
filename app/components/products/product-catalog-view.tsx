import { formatCurrency } from "~/lib/domain/value-objects/money";

import { PageHeader } from "../shared/page-header";

export function ProductCatalogView({
  products,
}: {
  products: Array<{
    id: string;
    name: string;
    category: string;
    temperatureZone: string;
    shelfLifeDays: number;
    packSize: string;
    marginBand: string;
    targetChannels: string[];
    basePrice: number;
    activeAccounts: number;
    whitespaceAccounts: number;
  }>;
}) {
  return (
    <main className="page">
      <PageHeader
        eyebrow="Products"
        title="温度帯と販路適合を踏まえて提案商品の順番を決める"
        copy="食品営業では、商品マスタは単なる SKU 一覧ではなく、温度帯、賞味期限、粗利、チャネル適合を伴う提案判断の基礎データです。"
      />

      <section className="tile-grid">
        {products.map((product) => (
          <article className="panel stack" key={product.id}>
            <div className="section-header">
              <div>
                <p className="eyebrow">{product.category}</p>
                <h2 className="section-title">{product.name}</h2>
              </div>
              <span className="pill">{product.marginBand}</span>
            </div>
            <div className="chip-row">
              <span className="chip">{product.temperatureZone}</span>
              <span className="chip">賞味 {product.shelfLifeDays} 日</span>
              <span className="chip">{product.packSize}</span>
            </div>
            <p className="subtle-text">標準単価 {formatCurrency(product.basePrice)}</p>
            <div className="summary-grid">
              <div className="summary-tile">導入先<strong>{product.activeAccounts}</strong></div>
              <div className="summary-tile">余地先<strong>{product.whitespaceAccounts}</strong></div>
              <div className="summary-tile">販路<strong>{product.targetChannels.join(" / ")}</strong></div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}