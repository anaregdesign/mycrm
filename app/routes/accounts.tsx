import type { Route } from "./+types/accounts";

import { AccountDirectoryView } from "~/components/accounts/account-directory-view";
import { useAccountDirectory } from "~/lib/client/usecase/accounts/use-account-directory";
import { loadAccounts } from "~/lib/server/usecase/load-accounts.server";

export function meta(_: Route.MetaArgs) {
  return [{ title: "MyCRM | アカウント" }];
}

export async function loader() {
  return loadAccounts();
}

export default function AccountsRoute({ loaderData }: Route.ComponentProps) {
  const directory = useAccountDirectory(loaderData);

  return (
    <AccountDirectoryView
      accounts={directory.visibleAccounts}
      channel={directory.state.channel}
      onChannelChange={directory.handlers.setChannel}
      onQueryChange={directory.handlers.setQuery}
      query={directory.state.query}
    />
  );
}