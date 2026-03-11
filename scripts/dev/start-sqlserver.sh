#!/usr/bin/env bash
set -euo pipefail

container_name="mycrm-sqlserver"
image="mcr.microsoft.com/mssql/server:2022-latest"
port="1433"
password="LocalPassword!23"

if docker ps -a --format '{{.Names}}' | grep -qx "$container_name"; then
  if [[ "$(docker inspect -f '{{.State.Running}}' "$container_name")" != "true" ]]; then
    docker start "$container_name" >/dev/null
  fi
else
  docker run \
    --name "$container_name" \
    --platform linux/amd64 \
    -e ACCEPT_EULA=Y \
    -e MSSQL_SA_PASSWORD="$password" \
    -p "$port:1433" \
    -d \
    "$image" >/dev/null
fi

until docker exec "$container_name" /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$password" -C -Q 'SELECT 1' >/dev/null 2>&1; do
  sleep 2
done

docker exec "$container_name" /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$password" -C -Q "IF DB_ID('mycrm') IS NULL CREATE DATABASE mycrm;" >/dev/null

echo "SQL Server is ready on localhost:$port with database mycrm."