import type { CrmRepository } from "~/lib/domain/repositories/crm-repository";

import { getAppConfig } from "../config/app-config.server";
import { DemoCrmRepository } from "./demo-crm-repository.server";
import { PrismaCrmRepository } from "./prisma-crm-repository.server";

export function createCrmRepository(): CrmRepository {
  const config = getAppConfig();

  if (config.dataSource === "prisma") {
    return new PrismaCrmRepository();
  }

  return new DemoCrmRepository();
}