import type { AccountDetail, AccountSummary } from "../entities/account";
import type { ActivitySummary } from "../entities/activity";
import type { OpportunitySummary } from "../entities/opportunity";
import type { ProductCatalogItem } from "../entities/product";

export interface CrmRepository {
  listAccounts(): Promise<AccountSummary[]>;
  getAccountDetail(accountId: string): Promise<AccountDetail | null>;
  listOpportunities(): Promise<OpportunitySummary[]>;
  listActivities(): Promise<ActivitySummary[]>;
  listProducts(): Promise<ProductCatalogItem[]>;
}