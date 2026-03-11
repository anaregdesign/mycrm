import type { Dispatch } from "react";

import type { DashboardAction } from "./reducer";

export function createDashboardHandlers(dispatch: Dispatch<DashboardAction>) {
  return {
    setChannel(channel: string) {
      dispatch({ type: "set-channel", channel });
    },
    setQuery(query: string) {
      dispatch({ type: "set-query", query });
    },
  };
}