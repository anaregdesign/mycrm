import type { Route } from "./+types/activities";

import { ActivityFeedView } from "~/components/activities/activity-feed-view";
import { loadActivities } from "~/lib/server/usecase/load-activities.server";

export function meta(_: Route.MetaArgs) {
  return [{ title: "MyCRM | 活動" }];
}

export async function loader() {
  return loadActivities();
}

export default function ActivitiesRoute({ loaderData }: Route.ComponentProps) {
  return <ActivityFeedView activities={loaderData} />;
}