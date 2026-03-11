import type { AccountSummary } from "~/lib/domain/entities/account";

import { createCrmRepository } from "../infrastructure/repositories/crm-repository-factory.server";

export interface DashboardMetric {
  label: string;
  value: number;
  detail: string;
}

export interface ChannelSnapshot {
  channel: string;
  accountCount: number;
  pipeline: number;
  whitespaceCount: number;
}

export interface StageSnapshot {
  stage: string;
  count: number;
  pipeline: number;
}

export interface DashboardData {
  metrics: DashboardMetric[];
  channels: ChannelSnapshot[];
  atRiskAccounts: AccountSummary[];
  whitespaceAccounts: AccountSummary[];
  stageSummary: StageSnapshot[];
  asOf: string;
}

export async function loadDashboard(): Promise<DashboardData> {
  const repository = createCrmRepository();
  const [accounts, opportunities, activities] = await Promise.all([
    repository.listAccounts(),
    repository.listOpportunities(),
    repository.listActivities(),
  ]);

  const totalPipeline = opportunities.reduce(
    (sum, item) => sum + item.expectedMonthlyRevenue,
    0,
  );

  const whitespaceAccounts = accounts
    .filter((item) => item.whitespaceProductNames.length > 0)
    .sort((left, right) => right.whitespaceProductNames.length - left.whitespaceProductNames.length);

  const atRiskAccounts = accounts.filter((item) => item.health !== "healthy");

  const channelMap = new Map<string, ChannelSnapshot>();
  for (const account of accounts) {
    const current = channelMap.get(account.channel) ?? {
      channel: account.channel,
      accountCount: 0,
      pipeline: 0,
      whitespaceCount: 0,
    };

    current.accountCount += 1;
    current.whitespaceCount += account.whitespaceProductNames.length;
    channelMap.set(account.channel, current);
  }

  for (const opportunity of opportunities) {
    const current = channelMap.get(opportunity.channel);
    if (current) {
      current.pipeline += opportunity.expectedMonthlyRevenue;
    }
  }

  const stageMap = new Map<string, StageSnapshot>();
  for (const opportunity of opportunities) {
    const current = stageMap.get(opportunity.stage) ?? {
      stage: opportunity.stage,
      count: 0,
      pipeline: 0,
    };

    current.count += 1;
    current.pipeline += opportunity.expectedMonthlyRevenue;
    stageMap.set(opportunity.stage, current);
  }

  return {
    metrics: [
      {
        label: "重点アカウント",
        value: accounts.length,
        detail: "本部商談と既存深耕を同時に追う主要法人数",
      },
      {
        label: "月次パイプライン",
        value: totalPipeline,
        detail: "採用確度を織り込む前の月次見込売上",
      },
      {
        label: "ホワイトスペース",
        value: whitespaceAccounts.length,
        detail: "導入余地のあるアカウント数",
      },
      {
        label: "直近活動",
        value: activities.length,
        detail: "今週予定とフォロー待ちを含む活動件数",
      },
    ],
    channels: [...channelMap.values()].sort((left, right) => right.pipeline - left.pipeline),
    atRiskAccounts,
    whitespaceAccounts,
    stageSummary: [...stageMap.values()].sort((left, right) => right.pipeline - left.pipeline),
    asOf: new Date().toISOString().slice(0, 10),
  };
}