import { createCrmRepository } from "../infrastructure/repositories/crm-repository-factory.server";

export async function loadProducts() {
  const repository = createCrmRepository();
  const [products, accounts] = await Promise.all([
    repository.listProducts(),
    repository.listAccounts(),
  ]);

  return products.map((product) => ({
    ...product,
    activeAccounts: accounts.filter((account) =>
      account.currentProductNames.includes(product.name),
    ).length,
    whitespaceAccounts: accounts.filter((account) =>
      account.whitespaceProductNames.includes(product.name),
    ).length,
  }));
}