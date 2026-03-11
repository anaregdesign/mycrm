import { useDeferredValue, useReducer } from "react";

import type { AccountSummary } from "~/lib/domain/entities/account";

import { createDashboardHandlers } from "./handlers";
import { dashboardReducer } from "./reducer";
import { filterAccounts } from "./selectors";
import { initialDashboardState } from "./state";

export function useDashboardAccounts(options: {
  atRiskAccounts: AccountSummary[];
  whitespaceAccounts: AccountSummary[];
}) {
  const [state, dispatch] = useReducer(dashboardReducer, initialDashboardState);
  const deferredQuery = useDeferredValue(state.query);
  const handlers = createDashboardHandlers(dispatch);

  return {
    state,
    handlers,
    filteredAtRiskAccounts: filterAccounts(options.atRiskAccounts, {
      ...state,
      query: deferredQuery,
    }),
    filteredWhitespaceAccounts: filterAccounts(options.whitespaceAccounts, {
      ...state,
      query: deferredQuery,
    }),
  };
}