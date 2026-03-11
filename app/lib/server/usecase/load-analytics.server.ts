import { createCrmRepository } from "../infrastructure/repositories/crm-repository-factory.server";

export async function loadAnalytics() {
  const repository = createCrmRepository();
  const [accounts, opportunities, products] = await Promise.all([
    repository.listAccounts(),
    repository.listOpportunities(),
    repository.listProducts(),
  ]);

  const channelPipeline = Object.values(
    opportunities.reduce<Record<string, { channel: string; pipeline: number; count: number }>>(
      (carry, opportunity) => {
        carry[opportunity.channel] ??= {
          channel: opportunity.channel,
          pipeline: 0,
          count: 0,
        };
        carry[opportunity.channel].pipeline += opportunity.expectedMonthlyRevenue;
        carry[opportunity.channel].count += 1;
        return carry;
      },
      {},
    ),
  ).sort((left, right) => right.pipeline - left.pipeline);

  const healthDistribution = Object.values(
    accounts.reduce<Record<string, { health: string; count: number }>>((carry, account) => {
      carry[account.health] ??= { health: account.health, count: 0 };
      carry[account.health].count += 1;
      return carry;
    }, {}),
  );

  const whitespaceByProduct = products
    .map((product) => ({
      productName: product.name,
      whitespaceAccounts: accounts.filter((account) =>
        account.whitespaceProductNames.includes(product.name),
      ).length,
    }))
    .sort((left, right) => right.whitespaceAccounts - left.whitespaceAccounts);

  return {
    channelPipeline,
    healthDistribution,
    whitespaceByProduct,
  };
}