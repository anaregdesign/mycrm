export interface OpportunityBoardItem {
  id: string;
  stage: string;
}

export function selectVisibleOpportunities<T extends OpportunityBoardItem>(
  opportunities: T[],
  stage: string,
) {
  if (stage === "all") {
    return opportunities;
  }

  return opportunities.filter((opportunity) => opportunity.stage === stage);
}