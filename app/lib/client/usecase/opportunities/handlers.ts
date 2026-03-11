import type { Dispatch } from "react";

import type { OpportunityBoardAction } from "./reducer";

export function createOpportunityBoardHandlers(dispatch: Dispatch<OpportunityBoardAction>) {
  return {
    setStage(stage: string) {
      dispatch({ type: "set-stage", stage });
    },
  };
}