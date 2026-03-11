import type { Channel } from "./account";

export type OpportunityStage =
  | "target"
  | "proposal"
  | "negotiation"
  | "pilot"
  | "won";

export interface OpportunitySummary {
  id: string;
  accountId: string;
  accountName: string;
  channel: Channel;
  title: string;
  stage: OpportunityStage;
  probability: number;
  expectedMonthlyRevenue: number;
  targetCloseMonth: string;
  owner: string;
  blockers: string[];
  nextStep: string;
  productIds: string[];
}