export interface AccountDirectoryState {
  query: string;
  channel: string;
}

export const initialAccountDirectoryState: AccountDirectoryState = {
  query: "",
  channel: "all",
};