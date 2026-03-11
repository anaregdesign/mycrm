import { beforeEach, describe, expect, it } from "vitest";

import { loadAccountDetail } from "./load-account-detail.server";

describe("loadAccountDetail", () => {
  beforeEach(() => {
    process.env.CRM_DATA_SOURCE = "demo";
    delete process.env.DATABASE_URL;
  });

  it("returns an account detail and recommended products for a known account", async () => {
    const result = await loadAccountDetail("acct-aeon");

    expect(result).not.toBeNull();
    expect(result?.detail.name).toBe("イオンリテール株式会社");
    expect(result?.detail.contacts.length).toBeGreaterThan(0);
    expect(result?.recommendedProducts.some((product) => product.name === "冷凍野菜餃子 24個")).toBe(true);
  });

  it("returns null for an unknown account", async () => {
    const result = await loadAccountDetail("missing-account");

    expect(result).toBeNull();
  });
});