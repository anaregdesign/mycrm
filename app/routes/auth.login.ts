import type { Route } from "./+types/auth.login";

import { beginMicrosoftEntraLogin } from "~/lib/server/infrastructure/auth/entra-auth.server";

export async function loader({ request }: Route.LoaderArgs) {
  return beginMicrosoftEntraLogin(request);
}