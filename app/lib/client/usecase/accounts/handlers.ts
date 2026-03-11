import type { Dispatch } from "react";

import type { AccountDirectoryAction } from "./reducer";

export function createAccountDirectoryHandlers(dispatch: Dispatch<AccountDirectoryAction>) {
  return {
    setQuery(query: string) {
      dispatch({ type: "set-query", query });
    },
    setChannel(channel: string) {
      dispatch({ type: "set-channel", channel });
    },
  };
}