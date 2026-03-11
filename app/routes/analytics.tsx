import type { Route } from "./+types/analytics";

import { AnalyticsView } from "~/components/analytics/analytics-view";
import { loadAnalytics } from "~/lib/server/usecase/load-analytics.server";

export function meta(_: Route.MetaArgs) {
  return [{ title: "MyCRM | 分析" }];
}

export async function loader() {
  return loadAnalytics();
}

export default function AnalyticsRoute({ loaderData }: Route.ComponentProps) {
  return <AnalyticsView analytics={loaderData} />;
}