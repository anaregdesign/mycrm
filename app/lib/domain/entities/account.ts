import type { ActivitySummary } from "./activity";
import type { OpportunitySummary } from "./opportunity";

export type Channel =
  | "retail"
  | "wholesale"
  | "distributor"
  | "foodservice"
  | "ecommerce";

export type AccountHealth = "healthy" | "watch" | "risk";

export interface AccountSummary {
  id: string;
  name: string;
  channel: Channel;
  region: string;
  segment: string;
  health: AccountHealth;
  annualRevenue: number;
  summary: string;
  nextAction: string;
  lastContactAt: string;
  currentProductNames: string[];
  whitespaceProductNames: string[];
}

export interface AccountSite {
  id: string;
  name: string;
  prefecture: string;
  format: string;
  monthlyVolume: number;
  installedSkus: number;
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  department: string;
  email?: string;
  phone?: string;
  influence: "decision-maker" | "champion" | "operator";
}

export interface SalesCondition {
  paymentTerms: string;
  rebateRate: number;
  leadTimeDays: number;
  minimumOrderValue: number;
  logisticsMode: string;
  promotionBudgetRatio: number;
}

export interface AccountDetail extends AccountSummary {
  sites: AccountSite[];
  contacts: Contact[];
  salesCondition: SalesCondition;
  opportunities: OpportunitySummary[];
  recentActivities: ActivitySummary[];
}