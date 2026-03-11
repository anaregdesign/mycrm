import { isRouteErrorResponse } from "react-router";

import type { Route } from "./+types/accounts.$accountId";

import { AccountDetailView } from "~/components/accounts/account-detail-view";
import { loadAccountDetail } from "~/lib/server/usecase/load-account-detail.server";

export function meta(_: Route.MetaArgs) {
  return [{ title: "MyCRM | アカウント詳細" }];
}

export async function loader({ params }: Route.LoaderArgs) {
  const result = await loadAccountDetail(params.accountId);

  if (!result) {
    throw new Response("Not Found", { status: 404 });
  }

  return result;
}

export default function AccountDetailRoute({ loaderData }: Route.ComponentProps) {
  return (
    <AccountDetailView
      detail={loaderData.detail}
      recommendedProducts={loaderData.recommendedProducts}
    />
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error) && error.status === 404) {
    return <main className="empty-state">指定したアカウントは見つかりませんでした。</main>;
  }

  throw error;
}