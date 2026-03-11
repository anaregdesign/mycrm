export interface DashboardState {
  channel: string;
  query: string;
}

export const initialDashboardState: DashboardState = {
  channel: "all",
  query: "",
};