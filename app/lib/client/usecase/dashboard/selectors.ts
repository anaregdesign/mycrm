import type { AccountSummary } from "~/lib/domain/entities/account";

import type { DashboardState } from "./state";

function matchesQuery(account: AccountSummary, query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  return [account.name, account.region, account.segment, ...account.whitespaceProductNames]
    .concat(account.currentProductNames)
    .join(" ")
    .toLowerCase()
    .includes(normalized);
}

export function filterAccounts(accounts: AccountSummary[], state: DashboardState) {
  return accounts.filter((account) => {
    const channelMatch = state.channel === "all" || account.channel === state.channel;
    return channelMatch && matchesQuery(account, state.query);
  });
}