import { describe, expect, it } from "vitest";

import type { AccountSummary } from "~/lib/domain/entities/account";

import { filterAccounts } from "./selectors";

const accounts: AccountSummary[] = [
  {
    id: "1",
    name: "イオンリテール株式会社",
    channel: "retail",
    region: "首都圏",
    segment: "GMS",
    health: "healthy",
    annualRevenue: 1000,
    summary: "summary",
    nextAction: "next",
    lastContactAt: "2026-03-01",
    currentProductNames: ["朝食グラノーラ 400g"],
    whitespaceProductNames: ["冷凍野菜餃子 24個"],
  },
  {
    id: "2",
    name: "国分グループ本社株式会社",
    channel: "wholesale",
    region: "全国",
    segment: "食品卸",
    health: "watch",
    annualRevenue: 2000,
    summary: "summary",
    nextAction: "next",
    lastContactAt: "2026-03-02",
    currentProductNames: ["業務用ごまドレッシング 1L"],
    whitespaceProductNames: ["冷凍野菜餃子 24個"],
  },
];

describe("filterAccounts", () => {
  it("filters by channel", () => {
    const result = filterAccounts(accounts, { channel: "retail", query: "" });

    expect(result).toHaveLength(1);
    expect(result[0]?.name).toBe("イオンリテール株式会社");
  });

  it("filters by query across account and whitespace product names", () => {
    const result = filterAccounts(accounts, {
      channel: "all",
      query: "ドレッシング",
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.name).toBe("国分グループ本社株式会社");
  });
});