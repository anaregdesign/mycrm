#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${AZURE_RESOURCE_GROUP:-}" || -z "${AZURE_CONTAINER_APP_NAME:-}" ]]; then
  echo "Skipping registry configuration because AZURE_RESOURCE_GROUP or AZURE_CONTAINER_APP_NAME is unset."
  exit 0
fi

if [[ -n "${CONTAINER_REGISTRY_SERVER:-}" && -n "${CONTAINER_REGISTRY_USERNAME:-}" && -n "${CONTAINER_REGISTRY_PASSWORD:-}" ]]; then
  az containerapp registry set \
    --resource-group "${AZURE_RESOURCE_GROUP}" \
    --name "${AZURE_CONTAINER_APP_NAME}" \
    --server "${CONTAINER_REGISTRY_SERVER}" \
    --username "${CONTAINER_REGISTRY_USERNAME}" \
    --password "${CONTAINER_REGISTRY_PASSWORD}"
fi

auth_values=(
  "${PUBLIC_APP_URL:-}"
  "${MICROSOFT_ENTRA_CLIENT_ID:-}"
  "${MICROSOFT_ENTRA_TENANT_ID:-}"
  "${MICROSOFT_ENTRA_CLIENT_SECRET:-}"
  "${SESSION_SECRET:-}"
)

has_auth_config=true
for value in "${auth_values[@]}"; do
  if [[ -z "$value" ]]; then
    has_auth_config=false
    break
  fi
done

if [[ "$has_auth_config" == true ]]; then
  entra_client_secret_name="microsoft-entra-client-secret"
  session_secret_name="session-secret"

  az containerapp secret set \
    --resource-group "${AZURE_RESOURCE_GROUP}" \
    --name "${AZURE_CONTAINER_APP_NAME}" \
    --secrets \
      "${entra_client_secret_name}=${MICROSOFT_ENTRA_CLIENT_SECRET}" \
      "${session_secret_name}=${SESSION_SECRET}"

  az containerapp update \
    --resource-group "${AZURE_RESOURCE_GROUP}" \
    --name "${AZURE_CONTAINER_APP_NAME}" \
    --set-env-vars \
      "PUBLIC_APP_URL=${PUBLIC_APP_URL}" \
      "MICROSOFT_ENTRA_CLIENT_ID=${MICROSOFT_ENTRA_CLIENT_ID}" \
      "MICROSOFT_ENTRA_TENANT_ID=${MICROSOFT_ENTRA_TENANT_ID}" \
      "MICROSOFT_ENTRA_CLIENT_SECRET=secretref:${entra_client_secret_name}" \
      "SESSION_SECRET=secretref:${session_secret_name}"
elif [[ -n "${PUBLIC_APP_URL:-}${MICROSOFT_ENTRA_CLIENT_ID:-}${MICROSOFT_ENTRA_TENANT_ID:-}${MICROSOFT_ENTRA_CLIENT_SECRET:-}${SESSION_SECRET:-}" ]]; then
  echo "Skipping Entra auth configuration because one or more required settings are missing."
fi