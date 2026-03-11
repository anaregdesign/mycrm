import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from "react-router";

import type { Route } from "./+types/root";
import { LoginScreen } from "./components/auth/login-screen";
import { AppShell } from "./components/shared/app-shell";
import { requireAuthenticatedUser } from "./lib/server/infrastructure/auth/entra-auth.server";
import "./app.css";

export const links: Route.LinksFunction = () => [];

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireAuthenticatedUser(request);

  return { user };
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <FluentProvider theme={webLightTheme}>
          {children}
          <ScrollRestoration />
          <Scripts />
        </FluentProvider>
      </body>
    </html>
  );
}

export default function App() {
  useLoaderData<typeof loader>();
  const location = useLocation();

  return (
    <AppShell pathname={location.pathname}>
      <Outlet />
    </AppShell>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    if (error.status === 401) {
      return <LoginScreen />;
    }

    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <AppShell pathname="/">
      <main className="error-state">
        <p className="eyebrow">Application Error</p>
        <h1>{message}</h1>
        <p>{details}</p>
        {stack ? (
          <pre className="error-stack">
            <code>{stack}</code>
          </pre>
        ) : null}
      </main>
    </AppShell>
  );
}
