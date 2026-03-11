import { useDeferredValue, useReducer } from "react";

import type { AccountSummary } from "~/lib/domain/entities/account";

import { createAccountDirectoryHandlers } from "./handlers";
import { accountDirectoryReducer } from "./reducer";
import { selectVisibleAccounts } from "./selectors";
import { initialAccountDirectoryState } from "./state";

export function useAccountDirectory(accounts: AccountSummary[]) {
  const [state, dispatch] = useReducer(
    accountDirectoryReducer,
    initialAccountDirectoryState,
  );
  const deferredQuery = useDeferredValue(state.query);

  return {
    state,
    handlers: createAccountDirectoryHandlers(dispatch),
    visibleAccounts: selectVisibleAccounts(accounts, {
      ...state,
      query: deferredQuery,
    }),
  };
}