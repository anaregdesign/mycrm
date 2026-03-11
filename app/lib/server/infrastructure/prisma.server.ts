import { PrismaMssql } from "@prisma/adapter-mssql";

import { PrismaClient } from "./generated/prisma/client";
import { getAppConfig } from "./config/app-config.server";

const globalForPrisma = globalThis as { prisma?: PrismaClient };

export function getPrismaClient() {
  const config = getAppConfig();

  if (!config.databaseUrl) {
    throw new Error("DATABASE_URL is required when CRM_DATA_SOURCE=prisma.");
  }

  if (!globalForPrisma.prisma) {
    const adapter = new PrismaMssql(config.databaseUrl);
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }

  return globalForPrisma.prisma;
}