import { createCrmRepository } from "../infrastructure/repositories/crm-repository-factory.server";

export async function loadAccountDetail(accountId: string) {
  const repository = createCrmRepository();
  const [detail, products] = await Promise.all([
    repository.getAccountDetail(accountId),
    repository.listProducts(),
  ]);

  if (!detail) {
    return null;
  }

  const recommendedProducts = products.filter((product) =>
    detail.whitespaceProductNames.includes(product.name),
  );

  return {
    detail,
    recommendedProducts,
  };
}