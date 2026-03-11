import { createCrmRepository } from "../infrastructure/repositories/crm-repository-factory.server";

export async function loadActivities() {
  const repository = createCrmRepository();
  return repository.listActivities();
}