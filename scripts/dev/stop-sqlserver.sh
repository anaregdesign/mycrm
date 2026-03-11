#!/usr/bin/env bash
set -euo pipefail

container_name="mycrm-sqlserver"

if docker ps -a --format '{{.Names}}' | grep -qx "$container_name"; then
  docker stop "$container_name" >/dev/null
  echo "Stopped $container_name."
else
  echo "$container_name does not exist."
fi