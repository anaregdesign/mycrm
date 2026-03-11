import { z } from "zod";

const appConfigSchema = z.object({
  CRM_APP_NAME: z.string().default("MyCRM"),
  CRM_DATA_SOURCE: z.enum(["demo", "prisma"]).default("demo"),
  DATABASE_URL: z.string().trim().min(1).optional(),
  PUBLIC_APP_URL: z.string().url().optional(),
  SESSION_SECRET: z.string().trim().min(32).optional(),
  MICROSOFT_ENTRA_CLIENT_ID: z.string().trim().min(1).optional(),
  MICROSOFT_ENTRA_CLIENT_SECRET: z.string().trim().min(1).optional(),
  MICROSOFT_ENTRA_TENANT_ID: z.string().trim().min(1).optional(),
  AZURE_APPCONFIG_ENDPOINT: z.string().url().optional(),
  AZURE_KEY_VAULT_URI: z.string().url().optional(),
  APPLICATIONINSIGHTS_CONNECTION_STRING: z.string().optional(),
});

export type AppConfig = ReturnType<typeof getAppConfig>;

export function getAppConfig() {
  const parsed = appConfigSchema.parse(process.env);

  return {
    appName: parsed.CRM_APP_NAME,
    dataSource: parsed.CRM_DATA_SOURCE,
    databaseUrl: parsed.DATABASE_URL ?? null,
    isProduction: process.env.NODE_ENV === "production",
    microsoftEntraClientId: parsed.MICROSOFT_ENTRA_CLIENT_ID ?? null,
    microsoftEntraClientSecret: parsed.MICROSOFT_ENTRA_CLIENT_SECRET ?? null,
    microsoftEntraTenantId: parsed.MICROSOFT_ENTRA_TENANT_ID ?? null,
    publicAppUrl: parsed.PUBLIC_APP_URL ?? null,
    sessionSecret: parsed.SESSION_SECRET ?? null,
    azureAppConfigEndpoint: parsed.AZURE_APPCONFIG_ENDPOINT ?? null,
    azureKeyVaultUri: parsed.AZURE_KEY_VAULT_URI ?? null,
    applicationInsightsConnectionString:
      parsed.APPLICATIONINSIGHTS_CONNECTION_STRING ?? null,
  };
}