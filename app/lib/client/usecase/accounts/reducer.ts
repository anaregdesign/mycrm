import type { AccountDirectoryState } from "./state";

export type AccountDirectoryAction =
  | { type: "set-query"; query: string }
  | { type: "set-channel"; channel: string };

export function accountDirectoryReducer(
  state: AccountDirectoryState,
  action: AccountDirectoryAction,
): AccountDirectoryState {
  switch (action.type) {
    case "set-query":
      return { ...state, query: action.query };
    case "set-channel":
      return { ...state, channel: action.channel };
    default:
      return state;
  }
}