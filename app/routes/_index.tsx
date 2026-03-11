import type { Route } from "./+types/_index";

import { DashboardView } from "~/components/dashboard/dashboard-view";
import { useDashboardAccounts } from "~/lib/client/usecase/dashboard/use-dashboard";
import { loadDashboard } from "~/lib/server/usecase/load-dashboard.server";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "MyCRM | ダッシュボード" },
    { name: "description", content: "食品営業向け CRM ダッシュボード" },
  ];
}

export async function loader() {
  return loadDashboard();
}

export default function IndexRoute({ loaderData }: Route.ComponentProps) {
  const dashboard = useDashboardAccounts({
    atRiskAccounts: loaderData.atRiskAccounts,
    whitespaceAccounts: loaderData.whitespaceAccounts,
  });

  return (
    <DashboardView
      atRiskAccounts={dashboard.filteredAtRiskAccounts}
      channel={dashboard.state.channel}
      data={loaderData}
      onChannelChange={dashboard.handlers.setChannel}
      onQueryChange={dashboard.handlers.setQuery}
      query={dashboard.state.query}
      whitespaceAccounts={dashboard.filteredWhitespaceAccounts}
    />
  );
}