import type { Route } from "./+types/auth.logout";

import { signOutUser } from "~/lib/server/infrastructure/auth/entra-auth.server";

export async function loader({ request }: Route.LoaderArgs) {
  return signOutUser(request);
}