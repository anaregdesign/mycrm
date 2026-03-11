import type { CrmRepository } from "~/lib/domain/repositories/crm-repository";

import {
  demoAccounts,
  demoActivities,
  demoContacts,
  demoOpportunities,
  demoProducts,
  demoSalesConditions,
  demoSites,
} from "./demo-data.server";

export class DemoCrmRepository implements CrmRepository {
  async listAccounts() {
    return demoAccounts;
  }

  async getAccountDetail(accountId: string) {
    const account = demoAccounts.find((item) => item.id === accountId);

    if (!account) {
      return null;
    }

    return {
      ...account,
      sites: demoSites[accountId] ?? [],
      contacts: demoContacts[accountId] ?? [],
      salesCondition: demoSalesConditions[accountId],
      opportunities: demoOpportunities.filter((item) => item.accountId === accountId),
      recentActivities: demoActivities.filter((item) => item.accountId === accountId),
    };
  }

  async listOpportunities() {
    return demoOpportunities;
  }

  async listActivities() {
    return demoActivities;
  }

  async listProducts() {
    return demoProducts;
  }
}