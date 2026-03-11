import type { DashboardState } from "./state";

export type DashboardAction =
  | { type: "set-channel"; channel: string }
  | { type: "set-query"; query: string };

export function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case "set-channel":
      return { ...state, channel: action.channel };
    case "set-query":
      return { ...state, query: action.query };
    default:
      return state;
  }
}