import type { OpportunityBoardState } from "./state";

export type OpportunityBoardAction = { type: "set-stage"; stage: string };

export function opportunityBoardReducer(
  state: OpportunityBoardState,
  action: OpportunityBoardAction,
): OpportunityBoardState {
  if (action.type === "set-stage") {
    return { ...state, stage: action.stage };
  }

  return state;
}