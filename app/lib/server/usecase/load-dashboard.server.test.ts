import { beforeEach, describe, expect, it } from "vitest";

import { loadDashboard } from "./load-dashboard.server";

describe("loadDashboard", () => {
  beforeEach(() => {
    process.env.CRM_DATA_SOURCE = "demo";
    delete process.env.DATABASE_URL;
  });

  it("returns dashboard metrics and channel snapshots from the demo repository", async () => {
    const dashboard = await loadDashboard();

    expect(dashboard.metrics).toHaveLength(4);
    expect(dashboard.channels.length).toBeGreaterThan(0);
    expect(dashboard.stageSummary.some((stage) => stage.stage === "proposal")).toBe(true);
    expect(dashboard.atRiskAccounts.some((account) => account.health === "risk")).toBe(true);
    expect(dashboard.whitespaceAccounts[0]?.whitespaceProductNames.length).toBeGreaterThan(0);
  });
});