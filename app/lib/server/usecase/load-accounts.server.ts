import { createCrmRepository } from "../infrastructure/repositories/crm-repository-factory.server";

export async function loadAccounts() {
  const repository = createCrmRepository();
  return repository.listAccounts();
}