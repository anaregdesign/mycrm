import type { Route } from "./+types/auth.callback.microsoft";

import { finishMicrosoftEntraLogin } from "~/lib/server/infrastructure/auth/entra-auth.server";

export async function loader({ request }: Route.LoaderArgs) {
  return finishMicrosoftEntraLogin(request);
}