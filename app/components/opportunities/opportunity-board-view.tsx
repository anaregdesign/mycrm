import { formatCompactCurrency, formatRatio } from "~/lib/domain/value-objects/money";

import { PageHeader } from "../shared/page-header";
import { StatusPill } from "../shared/status-pill";

const stages = ["target", "proposal", "negotiation", "pilot", "won"];

export function OpportunityBoardView({
  opportunities,
  stage,
  onStageChange,
}: {
  opportunities: Array<{
    id: string;
    accountName: string;
    title: string;
    stage: string;
    probability: number;
    expectedMonthlyRevenue: number;
    targetCloseMonth: string;
    owner: string;
    blockers: string[];
    nextStep: string;
    productNames: string[];
  }>;
  stage: string;
  onStageChange: (stage: string) => void;
}) {
  return (
    <main className="page">
      <PageHeader
        eyebrow="Opportunities"
        title="導入提案から採用までの流れを案件で追う"
        copy="販路別の採用パターンと阻害要因を案件単位で可視化し、粗利条件と販促条件を踏まえて営業順序を決めます。"
      />

      <section className="panel stack">
        <label className="field-label">
          ステージ
          <select className="select-input" onChange={(event) => onStageChange(event.currentTarget.value)} value={stage}>
            <option value="all">すべて</option>
            {stages.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
      </section>

      <section className="kanban">
        {stages.map((currentStage) => {
          const items = opportunities.filter((opportunity) => opportunity.stage === currentStage);

          return (
            <article className="kanban-column" key={currentStage}>
              <div className="section-header">
                <div>
                  <p className="eyebrow">{currentStage}</p>
                  <h2 className="section-title">{items.length} 件</h2>
                </div>
              </div>
              {items.map((opportunity) => (
                <div className="kanban-card" key={opportunity.id}>
                  <div className="list-card__top">
                    <div>
                      <strong>{opportunity.title}</strong>
                      <p className="list-meta">{opportunity.accountName}</p>
                    </div>
                    <StatusPill label={opportunity.stage} />
                  </div>
                  <p className="subtle-text">{opportunity.nextStep}</p>
                  <div className="chip-row">
                    <span className="chip">{formatCompactCurrency(opportunity.expectedMonthlyRevenue)}</span>
                    <span className="chip">{formatRatio(opportunity.probability)}</span>
                    <span className="chip">{opportunity.targetCloseMonth}</span>
                  </div>
                  <div className="chip-row">
                    {opportunity.productNames.map((name) => (
                      <span className="chip" key={name}>{name}</span>
                    ))}
                  </div>
                </div>
              ))}
            </article>
          );
        })}
      </section>
    </main>
  );
}