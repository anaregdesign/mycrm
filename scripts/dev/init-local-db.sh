#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
database_url="sqlserver://localhost:1433;database=mycrm;user=sa;password=LocalPassword!23;encrypt=false;trustServerCertificate=true"

cd "$repo_root"

./scripts/dev/start-sqlserver.sh

export CRM_DATA_SOURCE=prisma
export DATABASE_URL="$database_url"

npx prisma migrate deploy
npm run db:seed

echo "Local Prisma database is initialized."