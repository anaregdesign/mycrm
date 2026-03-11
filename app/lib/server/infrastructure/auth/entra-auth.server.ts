import { createCookieSessionStorage, redirect } from "react-router";
import * as oidc from "openid-client";

import { getAppConfig } from "../config/app-config.server";

type AuthenticatedUser = {
  email: string;
  name: string;
  objectId: string;
};

type AuthSession = {
  codeVerifier?: string;
  returnTo?: string;
  state?: string;
  user?: AuthenticatedUser;
};

const PUBLIC_PATH_PREFIXES = ["/auth/login", "/auth/callback/microsoft", "/health"];

function getEntraConfig() {
  const config = getAppConfig();

  if (!config.microsoftEntraClientId) {
    throw new Error("MICROSOFT_ENTRA_CLIENT_ID must be configured.");
  }

  if (!config.microsoftEntraTenantId) {
    throw new Error("MICROSOFT_ENTRA_TENANT_ID must be configured.");
  }

  if (!config.microsoftEntraClientSecret) {
    throw new Error("MICROSOFT_ENTRA_CLIENT_SECRET must be configured.");
  }

  if (!config.sessionSecret) {
    throw new Error("SESSION_SECRET must be configured.");
  }

  return {
    isProduction: config.isProduction,
    microsoftEntraClientId: config.microsoftEntraClientId,
    microsoftEntraClientSecret: config.microsoftEntraClientSecret,
    microsoftEntraTenantId: config.microsoftEntraTenantId,
    sessionSecret: config.sessionSecret,
  };
}

function getSessionStorage() {
  const config = getEntraConfig();

  return createCookieSessionStorage<AuthSession>({
    cookie: {
      httpOnly: true,
      maxAge: 60 * 60 * 8,
      name: "__session",
      path: "/",
      sameSite: "lax",
      secrets: [config.sessionSecret],
      secure: config.isProduction,
    },
  });
}

async function getOidcClient() {
  const config = getEntraConfig();
  const issuer = new URL(`https://login.microsoftonline.com/${config.microsoftEntraTenantId}/v2.0`);

  return oidc.discovery(
    issuer,
    config.microsoftEntraClientId,
    config.microsoftEntraClientSecret,
  );
}

function getRedirectUri(request: Request) {
  const requestUrl = new URL(request.url);

  return `${requestUrl.origin}/auth/callback/microsoft`;
}

function isPublicPath(pathname: string) {
  return PUBLIC_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function normalizeReturnTo(value: string | null) {
  if (!value || !value.startsWith("/")) {
    return "/";
  }

  return value;
}

function extractUser(claims: oidc.IDToken | undefined): AuthenticatedUser {
  const email =
    typeof claims?.preferred_username === "string"
      ? claims.preferred_username
      : typeof claims?.email === "string"
        ? claims.email
        : "unknown";

  return {
    email,
    name: typeof claims?.name === "string" ? claims.name : email,
    objectId: typeof claims?.oid === "string" ? claims.oid : email,
  };
}

export async function getAuthenticatedUser(request: Request) {
  const sessionStorage = getSessionStorage();
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));

  return session.get("user") ?? null;
}

export async function requireAuthenticatedUser(request: Request) {
  const pathname = new URL(request.url).pathname;

  if (isPublicPath(pathname)) {
    return null;
  }

  const user = await getAuthenticatedUser(request);

  if (!user) {
    throw new Response("Unauthorized", { status: 401 });
  }

  return user;
}

export async function beginMicrosoftEntraLogin(request: Request) {
  const sessionStorage = getSessionStorage();
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  const client = await getOidcClient();
  const requestUrl = new URL(request.url);
  const codeVerifier = oidc.randomPKCECodeVerifier();
  const codeChallenge = await oidc.calculatePKCECodeChallenge(codeVerifier);
  const state = oidc.randomState();
  const returnTo = normalizeReturnTo(requestUrl.searchParams.get("returnTo"));

  session.set("codeVerifier", codeVerifier);
  session.set("returnTo", returnTo);
  session.set("state", state);

  const authorizationUrl = oidc.buildAuthorizationUrl(client, {
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    redirect_uri: getRedirectUri(request),
    response_type: "code",
    scope: "openid profile email",
    state,
  });

  throw redirect(authorizationUrl.href, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

export async function finishMicrosoftEntraLogin(request: Request) {
  const sessionStorage = getSessionStorage();
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  const codeVerifier = session.get("codeVerifier");
  const expectedState = session.get("state");
  const rawReturnTo = session.get("returnTo");
  const returnTo = normalizeReturnTo(typeof rawReturnTo === "string" ? rawReturnTo : "/");

  if (!codeVerifier || !expectedState) {
    throw new Response("Invalid authentication session.", { status: 400 });
  }

  const client = await getOidcClient();
  const tokens = await oidc.authorizationCodeGrant(client, new URL(request.url), {
    expectedState: typeof expectedState === "string" ? expectedState : undefined,
    pkceCodeVerifier: typeof codeVerifier === "string" ? codeVerifier : undefined,
  });

  session.unset("codeVerifier");
  session.unset("returnTo");
  session.unset("state");
  session.set("user", extractUser(tokens.claims()));

  throw redirect(returnTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}