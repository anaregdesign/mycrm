import type { AccountSummary } from "~/lib/domain/entities/account";

import type { AccountDirectoryState } from "./state";

export function selectVisibleAccounts(
  accounts: AccountSummary[],
  state: AccountDirectoryState,
) {
  const query = state.query.trim().toLowerCase();

  return accounts.filter((account) => {
    const channelMatch = state.channel === "all" || account.channel === state.channel;
    const queryMatch =
      query.length === 0 ||
      [account.name, account.region, account.segment, ...account.currentProductNames]
        .join(" ")
        .toLowerCase()
        .includes(query);

    return channelMatch && queryMatch;
  });
}