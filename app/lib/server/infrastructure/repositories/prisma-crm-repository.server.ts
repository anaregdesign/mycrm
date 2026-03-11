import type { AccountHealth, Channel } from "~/lib/domain/entities/account";
import type { CrmRepository } from "~/lib/domain/repositories/crm-repository";

import { getPrismaClient } from "../prisma.server";

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export class PrismaCrmRepository implements CrmRepository {
  private prisma = getPrismaClient();

  async listAccounts() {
    const accounts = await this.prisma.account.findMany({
      orderBy: [{ annualRevenue: "desc" }],
    });

    return accounts.map((account) => ({
      id: account.id,
      name: account.name,
      channel: account.channel as Channel,
      region: account.region,
      segment: account.segment,
      health: account.health as AccountHealth,
      annualRevenue: Number(account.annualRevenue),
      summary: account.summary,
      nextAction: account.nextAction,
      lastContactAt: account.lastContactAt.toISOString().slice(0, 10),
      currentProductNames: splitList(account.currentProductNames),
      whitespaceProductNames: splitList(account.whitespaceProductNames),
    }));
  }

  async getAccountDetail(accountId: string) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
      include: {
        activities: true,
        contacts: true,
        opportunities: {
          include: {
            products: true,
          },
        },
        salesCondition: true,
        sites: true,
      },
    });

    if (!account || !account.salesCondition) {
      return null;
    }

    return {
      id: account.id,
      name: account.name,
      channel: account.channel as Channel,
      region: account.region,
      segment: account.segment,
      health: account.health as AccountHealth,
      annualRevenue: Number(account.annualRevenue),
      summary: account.summary,
      nextAction: account.nextAction,
      lastContactAt: account.lastContactAt.toISOString().slice(0, 10),
      currentProductNames: splitList(account.currentProductNames),
      whitespaceProductNames: splitList(account.whitespaceProductNames),
      sites: account.sites.map((site) => ({
        id: site.id,
        name: site.name,
        prefecture: site.prefecture,
        format: site.format,
        monthlyVolume: site.monthlyVolume,
        installedSkus: site.installedSkus,
      })),
      contacts: account.contacts.map((contact) => ({
        id: contact.id,
        name: contact.name,
        role: contact.role,
        department: contact.department,
        email: contact.email ?? undefined,
        phone: contact.phone ?? undefined,
        influence: contact.influence as "decision-maker" | "champion" | "operator",
      })),
      salesCondition: {
        paymentTerms: account.salesCondition.paymentTerms,
        rebateRate: Number(account.salesCondition.rebateRate),
        leadTimeDays: account.salesCondition.leadTimeDays,
        minimumOrderValue: Number(account.salesCondition.minimumOrderValue),
        logisticsMode: account.salesCondition.logisticsMode,
        promotionBudgetRatio: Number(account.salesCondition.promotionBudgetRatio),
      },
      opportunities: account.opportunities.map((item) => ({
        id: item.id,
        accountId: account.id,
        accountName: account.name,
        channel: account.channel as Channel,
        title: item.title,
        stage: item.stage as "target" | "proposal" | "negotiation" | "pilot" | "won",
        probability: item.probability,
        expectedMonthlyRevenue: Number(item.expectedMonthlyRevenue),
        targetCloseMonth: item.targetCloseMonth,
        owner: item.owner,
        blockers: splitList(item.blockers),
        nextStep: item.nextStep,
        productIds: item.products.map((product) => product.productId),
      })),
      recentActivities: account.activities.map((activity) => ({
        id: activity.id,
        accountId: account.id,
        accountName: account.name,
        type: activity.type as "visit" | "tasting" | "quote" | "sample" | "review",
        subject: activity.subject,
        scheduledFor: activity.scheduledFor.toISOString().slice(0, 10),
        owner: activity.owner,
        status: activity.status as "scheduled" | "done" | "needs-follow-up",
        notes: activity.notes,
      })),
    };
  }

  async listOpportunities() {
    const opportunities = await this.prisma.opportunity.findMany({
      include: {
        account: true,
        products: true,
      },
    });

    return opportunities.map((item) => ({
      id: item.id,
      accountId: item.accountId,
      accountName: item.account.name,
      channel: item.account.channel as Channel,
      title: item.title,
      stage: item.stage as "target" | "proposal" | "negotiation" | "pilot" | "won",
      probability: item.probability,
      expectedMonthlyRevenue: Number(item.expectedMonthlyRevenue),
      targetCloseMonth: item.targetCloseMonth,
      owner: item.owner,
      blockers: splitList(item.blockers),
      nextStep: item.nextStep,
      productIds: item.products.map((product) => product.productId),
    }));
  }

  async listActivities() {
    const activities = await this.prisma.activity.findMany({
      include: {
        account: true,
      },
      orderBy: [{ scheduledFor: "asc" }],
    });

    return activities.map((activity) => ({
      id: activity.id,
      accountId: activity.accountId,
      accountName: activity.account.name,
      type: activity.type as "visit" | "tasting" | "quote" | "sample" | "review",
      subject: activity.subject,
      scheduledFor: activity.scheduledFor.toISOString().slice(0, 10),
      owner: activity.owner,
      status: activity.status as "scheduled" | "done" | "needs-follow-up",
      notes: activity.notes,
    }));
  }

  async listProducts() {
    const products = await this.prisma.product.findMany({
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      temperatureZone: product.temperatureZone as "ambient" | "chilled" | "frozen",
      shelfLifeDays: product.shelfLifeDays,
      packSize: product.packSize,
      marginBand: product.marginBand,
      targetChannels: splitList(product.targetChannels) as Channel[],
      basePrice: Number(product.basePrice),
    }));
  }
}