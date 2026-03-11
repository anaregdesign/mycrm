import { createCrmRepository } from "../infrastructure/repositories/crm-repository-factory.server";

export async function loadOpportunities() {
  const repository = createCrmRepository();
  const [opportunities, products] = await Promise.all([
    repository.listOpportunities(),
    repository.listProducts(),
  ]);

  return opportunities.map((opportunity) => ({
    ...opportunity,
    productNames: products
      .filter((product) => opportunity.productIds.includes(product.id))
      .map((product) => product.name),
  }));
}