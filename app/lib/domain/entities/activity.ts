export type ActivityType = "visit" | "tasting" | "quote" | "sample" | "review";
export type ActivityStatus = "scheduled" | "done" | "needs-follow-up";

export interface ActivitySummary {
  id: string;
  accountId: string;
  accountName: string;
  type: ActivityType;
  subject: string;
  scheduledFor: string;
  owner: string;
  status: ActivityStatus;
  notes: string;
}