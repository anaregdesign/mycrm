import type { Route } from "./+types/opportunities";

import { OpportunityBoardView } from "~/components/opportunities/opportunity-board-view";
import { useOpportunityBoard } from "~/lib/client/usecase/opportunities/use-opportunity-board";
import { loadOpportunities } from "~/lib/server/usecase/load-opportunities.server";

export function meta(_: Route.MetaArgs) {
  return [{ title: "MyCRM | 案件" }];
}

export async function loader() {
  return loadOpportunities();
}

export default function OpportunitiesRoute({ loaderData }: Route.ComponentProps) {
  const board = useOpportunityBoard(loaderData);

  return (
    <OpportunityBoardView
      onStageChange={board.handlers.setStage}
      opportunities={board.visibleOpportunities}
      stage={board.state.stage}
    />
  );
}