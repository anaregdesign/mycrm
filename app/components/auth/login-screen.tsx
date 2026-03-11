import fluentReactComponents from "@fluentui/react-components";

const { Badge, Body1, Button, Card, Title2 } = fluentReactComponents;
import { useLocation } from "react-router";

export function LoginScreen() {
  const location = useLocation();
  const returnTo = `${location.pathname}${location.search}`;

  return (
    <main className="login-screen">
      <Card className="login-screen__card">
        <Badge appearance="outline" className="eyebrow">
          Microsoft Entra ID
        </Badge>
        <Title2 as="h1" className="login-screen__title">
          ログインして MyCRM を利用してください
        </Title2>
        <Body1 className="login-screen__copy">
          このアプリは組織アカウントでのサインインが必須です。未ログイン時は業務データを表示しません。
        </Body1>
        <div className="login-screen__actions">
          <Button
            appearance="primary"
            as="a"
            className="login-screen__button"
            href={`/auth/login?returnTo=${encodeURIComponent(returnTo)}`}
          >
            Entra ID でログイン
          </Button>
        </div>
      </Card>
    </main>
  );
}