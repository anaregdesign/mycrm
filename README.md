# MyCRM

食品メーカー/卸の法人営業を前提にした CRM の MVP です。小売本部、卸、代理店、外食、EC を横断して、アカウント管理、案件進捗、活動計画、商品提案、取引条件、KPI を一つの React Router アプリで扱います。

## Application Scope

- ダッシュボード: 販路別売上見込、重点 KPI、導入余地、滞留案件
- アカウント管理: 法人、拠点、担当者、健全性、導入状況、次アクション
- 案件管理: 新規導入、棚獲得、リニューアル、価格改定、採用確度
- 活動管理: 訪問、試食会、見積、サンプル送付、バイヤー折衝の可視化
- 商品提案: 温度帯、カテゴリ、賞味期限、販路適合、粗利帯
- 分析: チャネル別パイプライン、失注要因、重点 SKU のホワイトスペース

## Architecture

- React Router framework runtime
- Flat Routes under `app/routes/`
- Clean architecture boundaries under `app/lib/client`, `app/lib/server`, `app/lib/domain`
- Prisma v7 configured for `sqlserver` so Azure SQL Database serverless is the production target
- Azure-ready repo structure with `infra/`, `scripts/azure/`, `azure.yaml`, `Dockerfile`, and release workflow

## Runtime Modes

このアプリは 2 つのデータモードを持ちます。

- Demo mode: `CRM_DATA_SOURCE` 未指定時にデモデータを使用
- Prisma mode: `CRM_DATA_SOURCE=prisma` かつ `DATABASE_URL` 設定時に Prisma repository を使用

ローカル検証では demo mode だけで UI とルーティングを確認できます。Azure では Container Apps + Azure SQL の構成を想定しています。

## Commands

```bash
npm install
npm run dev
npm run dev:prisma
npm run test
npm run typecheck
npm run build
npm run db:generate
npm run db:seed
npm run db:local:start
npm run db:local:init
```

## Database Bootstrap

初期 migration は [prisma/migrations/0001_init/migration.sql](/Users/hiroki/mycrm/prisma/migrations/0001_init/migration.sql) に生成済みです。Azure SQL またはローカル SQL Server に対して `DATABASE_URL` を設定した上で、次の順で進めます。

```bash
export CRM_DATA_SOURCE=prisma
export DATABASE_URL='sqlserver://<server>:1433;database=<db>;user=<user>;password=<password>;encrypt=true;trustServerCertificate=false'

npm run db:generate
npm run db:seed
```

ローカル SQL Server を Docker で起動する場合は、以下の簡略手順で同じ状態を再現できます。

```bash
npm run db:local:start
npm run db:local:init
npm run dev:prisma
```

開発中に Prisma Migrate を使って差分を積む場合は `npm run db:migrate` を使います。Azure SQL の本番反映は [prisma/migrations/0001_init/migration.sql](/Users/hiroki/mycrm/prisma/migrations/0001_init/migration.sql) を基準に、運用フローに合わせて適用してください。

## Configuration Contract

`.env` は使いません。ローカルはシェル環境変数、Azure は App Configuration / Key Vault / Container Apps の環境変数から解決します。

主なキー:

- `CRM_DATA_SOURCE`: `demo` または `prisma`
- `DATABASE_URL`: Prisma が利用する Azure SQL 接続文字列
- `PUBLIC_APP_URL`: 公開 URL
- `AZURE_APPCONFIG_ENDPOINT`: Azure App Configuration endpoint
- `AZURE_KEY_VAULT_URI`: Key Vault URI
- `APPLICATIONINSIGHTS_CONNECTION_STRING`: App Insights 接続文字列

## Azure Delivery

- `azure.yaml`: Container Apps 向けの `azd` エントリ
- `infra/main.bicep`: Container Apps, Log Analytics, App Configuration, Key Vault, Azure SQL を定義
- `.github/workflows/ci.yml`: push / pull request 時に test, typecheck, build を実行
- `.github/workflows/release-container-image.yml`: GitHub Release 発火で GHCR publish と Azure deploy
- `scripts/azure/postprovision.sh`: Container App の registry 設定など補助処理

GitHub Actions で Azure deploy まで使う場合は、GitHub の `production` Environment に以下を用意します。

- Variables: `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`, `AZURE_RESOURCE_GROUP`, `AZURE_CONTAINER_APP_NAME`, `GHCR_PULL_USERNAME`
- Secrets: `GHCR_PULL_TOKEN`

Azure SQL は Microsoft Entra 管理者を必須にしているため、初回の Bicep デプロイでは `sqlAdministratorLogin` と `sqlAdministratorObjectId` を現在の Azure 利用者または管理用グループで渡します。Container App には `DATABASE_URL=sqlserver://<fqdn>:1433;database=<db>;encrypt=true;trustServerCertificate=false;authentication=ActiveDirectoryDefault` が自動で設定され、実行時はマネージド ID で Azure SQL に接続します。

VS Code の workflow 診断でこれらが未定義と警告されても、GitHub 側で Environment と Variables を作れば解消します。

## Notes

- デフォルト実装は要件確認と画面検証を優先した MVP です
- Prisma schema と repository は本番向けの拡張ポイントを持ちます
- `app/routes/health.ts` は Container Apps のヘルスチェックに利用します
- コアロジックの回帰確認は `npm run test` で実行できます
