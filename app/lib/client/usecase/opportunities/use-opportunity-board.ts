import { useReducer } from "react";

import { createOpportunityBoardHandlers } from "./handlers";
import { opportunityBoardReducer } from "./reducer";
import { selectVisibleOpportunities } from "./selectors";
import { initialOpportunityBoardState } from "./state";

export function useOpportunityBoard<T extends { id: string; stage: string }>(
  opportunities: T[],
) {
  const [state, dispatch] = useReducer(
    opportunityBoardReducer,
    initialOpportunityBoardState,
  );

  return {
    state,
    handlers: createOpportunityBoardHandlers(dispatch),
    visibleOpportunities: selectVisibleOpportunities(opportunities, state.stage),
  };
}