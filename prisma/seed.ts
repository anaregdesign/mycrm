import { PrismaMssql } from "@prisma/adapter-mssql";

import { PrismaClient } from "../app/lib/server/infrastructure/generated/prisma/client";
import {
  demoAccounts,
  demoActivities,
  demoContacts,
  demoOpportunities,
  demoProducts,
  demoSalesConditions,
  demoSites,
} from "../app/lib/server/infrastructure/repositories/demo-data.server";

const seedDatabaseUrl =
  process.env.DATABASE_URL ??
  "sqlserver://localhost:1433;database=mycrm;user=sa;password=LocalPassword!23;encrypt=false;trustServerCertificate=true";

const prisma = new PrismaClient({
  adapter: new PrismaMssql(seedDatabaseUrl),
});

async function main() {
  await prisma.opportunityProduct.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.salesCondition.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.accountSite.deleteMany();
  await prisma.opportunity.deleteMany();
  await prisma.product.deleteMany();
  await prisma.account.deleteMany();

  for (const product of demoProducts) {
    await prisma.product.create({
      data: {
        id: product.id,
        name: product.name,
        category: product.category,
        temperatureZone: product.temperatureZone,
        shelfLifeDays: product.shelfLifeDays,
        packSize: product.packSize,
        marginBand: product.marginBand,
        targetChannels: product.targetChannels.join(", "),
        basePrice: product.basePrice,
      },
    });
  }

  for (const account of demoAccounts) {
    await prisma.account.create({
      data: {
        id: account.id,
        name: account.name,
        channel: account.channel,
        region: account.region,
        segment: account.segment,
        health: account.health,
        annualRevenue: account.annualRevenue,
        summary: account.summary,
        nextAction: account.nextAction,
        lastContactAt: new Date(account.lastContactAt),
        currentProductNames: account.currentProductNames.join(", "),
        whitespaceProductNames: account.whitespaceProductNames.join(", "),
      },
    });

    for (const site of demoSites[account.id] ?? []) {
      await prisma.accountSite.create({
        data: {
          id: site.id,
          accountId: account.id,
          name: site.name,
          prefecture: site.prefecture,
          format: site.format,
          monthlyVolume: site.monthlyVolume,
          installedSkus: site.installedSkus,
        },
      });
    }

    for (const contact of demoContacts[account.id] ?? []) {
      await prisma.contact.create({
        data: {
          id: contact.id,
          accountId: account.id,
          name: contact.name,
          role: contact.role,
          department: contact.department,
          email: contact.email,
          phone: contact.phone,
          influence: contact.influence,
        },
      });
    }

    const condition = demoSalesConditions[account.id];
    await prisma.salesCondition.create({
      data: {
        id: `${account.id}-condition`,
        accountId: account.id,
        paymentTerms: condition.paymentTerms,
        rebateRate: condition.rebateRate,
        leadTimeDays: condition.leadTimeDays,
        minimumOrderValue: condition.minimumOrderValue,
        logisticsMode: condition.logisticsMode,
        promotionBudgetRatio: condition.promotionBudgetRatio,
      },
    });
  }

  for (const opportunity of demoOpportunities) {
    await prisma.opportunity.create({
      data: {
        id: opportunity.id,
        accountId: opportunity.accountId,
        title: opportunity.title,
        stage: opportunity.stage,
        probability: opportunity.probability,
        expectedMonthlyRevenue: opportunity.expectedMonthlyRevenue,
        targetCloseMonth: opportunity.targetCloseMonth,
        owner: opportunity.owner,
        blockers: opportunity.blockers.join(", "),
        nextStep: opportunity.nextStep,
        products: {
          create: opportunity.productIds.map((productId) => ({ productId })),
        },
      },
    });
  }

  for (const activity of demoActivities) {
    await prisma.activity.create({
      data: {
        id: activity.id,
        accountId: activity.accountId,
        type: activity.type,
        subject: activity.subject,
        scheduledFor: new Date(activity.scheduledFor),
        owner: activity.owner,
        status: activity.status,
        notes: activity.notes,
      },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });