import { readFile } from "node:fs/promises";

import sql from "mssql";

import {
  demoAccounts,
  demoActivities,
  demoContacts,
  demoOpportunities,
  demoProducts,
  demoSalesConditions,
  demoSites,
} from "../../app/lib/server/infrastructure/repositories/demo-data.server";

const databaseUrl = process.env.DATABASE_URL;
const principalName = process.env.AZURE_SQL_APP_PRINCIPAL_NAME ?? "ca-mycrm";
const accessToken = process.env.AZURE_SQL_ACCESS_TOKEN;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required.");
}

if (!accessToken) {
  throw new Error("AZURE_SQL_ACCESS_TOKEN is required.");
}

function parseSqlServerConnectionString(connectionString: string) {
  const [serverPart, ...parameterParts] = connectionString.split(";");
  const server = serverPart.replace(/^sqlserver:\/\//, "").replace(/:\d+$/, "");
  const parameters = new Map(
    parameterParts
      .map((part) => part.split("="))
      .filter((parts) => parts.length === 2)
      .map(([key, value]) => [key.toLowerCase(), value]),
  );
  const database = parameters.get("database");

  if (!server || !database) {
    throw new Error("DATABASE_URL must include server and database.");
  }

  return { database, server };
}

const { database, server } = parseSqlServerConnectionString(databaseUrl);

const pool = new sql.ConnectionPool({
  server,
  database,
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
  authentication: {
    type: "azure-active-directory-access-token",
    options: {
      token: accessToken,
    },
  },
});

async function hasAccountTable() {
  const result = await pool
    .request()
    .query(`
      SELECT COUNT(1) AS count
      FROM sys.tables
      WHERE name = N'Account'
        AND schema_id = SCHEMA_ID(N'dbo')
    `);

  return Number(result.recordset[0]?.count ?? 0) > 0;
}

async function applyInitialMigrationIfNeeded() {
  if (await hasAccountTable()) {
    return;
  }

  const migrationSql = await readFile(
    new URL("../../prisma/migrations/0001_init/migration.sql", import.meta.url),
    "utf8",
  );

  await pool.request().batch(migrationSql);
}

async function seedDatabase() {
  const transaction = new sql.Transaction(pool);
  await transaction.begin();

  try {
    await new sql.Request(transaction).batch(`
      DELETE FROM [dbo].[OpportunityProduct];
      DELETE FROM [dbo].[Activity];
      DELETE FROM [dbo].[SalesCondition];
      DELETE FROM [dbo].[Contact];
      DELETE FROM [dbo].[AccountSite];
      DELETE FROM [dbo].[Opportunity];
      DELETE FROM [dbo].[Product];
      DELETE FROM [dbo].[Account];
    `);

    for (const product of demoProducts) {
      await new sql.Request(transaction)
        .input("id", sql.NVarChar(sql.MAX), product.id)
        .input("name", sql.NVarChar(sql.MAX), product.name)
        .input("category", sql.NVarChar(sql.MAX), product.category)
        .input("temperatureZone", sql.NVarChar(sql.MAX), product.temperatureZone)
        .input("shelfLifeDays", sql.Int, product.shelfLifeDays)
        .input("packSize", sql.NVarChar(sql.MAX), product.packSize)
        .input("marginBand", sql.NVarChar(sql.MAX), product.marginBand)
        .input("targetChannels", sql.NVarChar(sql.MAX), product.targetChannels.join(", "))
        .input("basePrice", sql.Decimal(18, 2), product.basePrice)
        .query(`
          INSERT INTO [dbo].[Product] (
            [id], [name], [category], [temperatureZone], [shelfLifeDays],
            [packSize], [marginBand], [targetChannels], [basePrice]
          ) VALUES (
            @id, @name, @category, @temperatureZone, @shelfLifeDays,
            @packSize, @marginBand, @targetChannels, @basePrice
          )
        `);
    }

    for (const account of demoAccounts) {
      await new sql.Request(transaction)
        .input("id", sql.NVarChar(sql.MAX), account.id)
        .input("name", sql.NVarChar(sql.MAX), account.name)
        .input("channel", sql.NVarChar(sql.MAX), account.channel)
        .input("region", sql.NVarChar(sql.MAX), account.region)
        .input("segment", sql.NVarChar(sql.MAX), account.segment)
        .input("health", sql.NVarChar(sql.MAX), account.health)
        .input("annualRevenue", sql.Decimal(18, 2), account.annualRevenue)
        .input("summary", sql.NVarChar(sql.MAX), account.summary)
        .input("nextAction", sql.NVarChar(sql.MAX), account.nextAction)
        .input("lastContactAt", sql.DateTime2, new Date(account.lastContactAt))
        .input("currentProductNames", sql.NVarChar(sql.MAX), account.currentProductNames.join(", "))
        .input("whitespaceProductNames", sql.NVarChar(sql.MAX), account.whitespaceProductNames.join(", "))
        .input("updatedAt", sql.DateTime2, new Date())
        .query(`
          INSERT INTO [dbo].[Account] (
            [id], [name], [channel], [region], [segment], [health], [annualRevenue],
            [summary], [nextAction], [lastContactAt], [currentProductNames],
            [whitespaceProductNames], [updatedAt]
          ) VALUES (
            @id, @name, @channel, @region, @segment, @health, @annualRevenue,
            @summary, @nextAction, @lastContactAt, @currentProductNames,
            @whitespaceProductNames, @updatedAt
          )
        `);

      for (const site of demoSites[account.id] ?? []) {
        await new sql.Request(transaction)
          .input("id", sql.NVarChar(sql.MAX), site.id)
          .input("accountId", sql.NVarChar(sql.MAX), account.id)
          .input("name", sql.NVarChar(sql.MAX), site.name)
          .input("prefecture", sql.NVarChar(sql.MAX), site.prefecture)
          .input("format", sql.NVarChar(sql.MAX), site.format)
          .input("monthlyVolume", sql.Int, site.monthlyVolume)
          .input("installedSkus", sql.Int, site.installedSkus)
          .query(`
            INSERT INTO [dbo].[AccountSite] (
              [id], [accountId], [name], [prefecture], [format], [monthlyVolume], [installedSkus]
            ) VALUES (
              @id, @accountId, @name, @prefecture, @format, @monthlyVolume, @installedSkus
            )
          `);
      }

      for (const contact of demoContacts[account.id] ?? []) {
        await new sql.Request(transaction)
          .input("id", sql.NVarChar(sql.MAX), contact.id)
          .input("accountId", sql.NVarChar(sql.MAX), account.id)
          .input("name", sql.NVarChar(sql.MAX), contact.name)
          .input("role", sql.NVarChar(sql.MAX), contact.role)
          .input("department", sql.NVarChar(sql.MAX), contact.department)
          .input("email", sql.NVarChar(sql.MAX), contact.email ?? null)
          .input("phone", sql.NVarChar(sql.MAX), contact.phone ?? null)
          .input("influence", sql.NVarChar(sql.MAX), contact.influence)
          .query(`
            INSERT INTO [dbo].[Contact] (
              [id], [accountId], [name], [role], [department], [email], [phone], [influence]
            ) VALUES (
              @id, @accountId, @name, @role, @department, @email, @phone, @influence
            )
          `);
      }

      const salesCondition = demoSalesConditions[account.id];
      await new sql.Request(transaction)
        .input("id", sql.NVarChar(sql.MAX), `${account.id}-condition`)
        .input("accountId", sql.NVarChar(sql.MAX), account.id)
        .input("paymentTerms", sql.NVarChar(sql.MAX), salesCondition.paymentTerms)
        .input("rebateRate", sql.Decimal(5, 2), salesCondition.rebateRate)
        .input("leadTimeDays", sql.Int, salesCondition.leadTimeDays)
        .input("minimumOrderValue", sql.Decimal(18, 2), salesCondition.minimumOrderValue)
        .input("logisticsMode", sql.NVarChar(sql.MAX), salesCondition.logisticsMode)
        .input("promotionBudgetRatio", sql.Decimal(5, 2), salesCondition.promotionBudgetRatio)
        .query(`
          INSERT INTO [dbo].[SalesCondition] (
            [id], [accountId], [paymentTerms], [rebateRate], [leadTimeDays],
            [minimumOrderValue], [logisticsMode], [promotionBudgetRatio]
          ) VALUES (
            @id, @accountId, @paymentTerms, @rebateRate, @leadTimeDays,
            @minimumOrderValue, @logisticsMode, @promotionBudgetRatio
          )
        `);
    }

    for (const opportunity of demoOpportunities) {
      await new sql.Request(transaction)
        .input("id", sql.NVarChar(sql.MAX), opportunity.id)
        .input("accountId", sql.NVarChar(sql.MAX), opportunity.accountId)
        .input("title", sql.NVarChar(sql.MAX), opportunity.title)
        .input("stage", sql.NVarChar(sql.MAX), opportunity.stage)
        .input("probability", sql.Int, opportunity.probability)
        .input("expectedMonthlyRevenue", sql.Decimal(18, 2), opportunity.expectedMonthlyRevenue)
        .input("targetCloseMonth", sql.NVarChar(sql.MAX), opportunity.targetCloseMonth)
        .input("owner", sql.NVarChar(sql.MAX), opportunity.owner)
        .input("blockers", sql.NVarChar(sql.MAX), opportunity.blockers.join(", "))
        .input("nextStep", sql.NVarChar(sql.MAX), opportunity.nextStep)
        .query(`
          INSERT INTO [dbo].[Opportunity] (
            [id], [accountId], [title], [stage], [probability], [expectedMonthlyRevenue],
            [targetCloseMonth], [owner], [blockers], [nextStep]
          ) VALUES (
            @id, @accountId, @title, @stage, @probability, @expectedMonthlyRevenue,
            @targetCloseMonth, @owner, @blockers, @nextStep
          )
        `);

      for (const productId of opportunity.productIds) {
        await new sql.Request(transaction)
          .input("opportunityId", sql.NVarChar(sql.MAX), opportunity.id)
          .input("productId", sql.NVarChar(sql.MAX), productId)
          .query(`
            INSERT INTO [dbo].[OpportunityProduct] ([opportunityId], [productId])
            VALUES (@opportunityId, @productId)
          `);
      }
    }

    for (const activity of demoActivities) {
      await new sql.Request(transaction)
        .input("id", sql.NVarChar(sql.MAX), activity.id)
        .input("accountId", sql.NVarChar(sql.MAX), activity.accountId)
        .input("type", sql.NVarChar(sql.MAX), activity.type)
        .input("subject", sql.NVarChar(sql.MAX), activity.subject)
        .input("scheduledFor", sql.DateTime2, new Date(activity.scheduledFor))
        .input("owner", sql.NVarChar(sql.MAX), activity.owner)
        .input("status", sql.NVarChar(sql.MAX), activity.status)
        .input("notes", sql.NVarChar(sql.MAX), activity.notes)
        .query(`
          INSERT INTO [dbo].[Activity] (
            [id], [accountId], [type], [subject], [scheduledFor], [owner], [status], [notes]
          ) VALUES (
            @id, @accountId, @type, @subject, @scheduledFor, @owner, @status, @notes
          )
        `);
    }

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function ensureDatabaseUser() {
  const escapedPrincipalName = principalName.replace(/]/g, "]]" );
  const escapedQuotedPrincipalName = principalName.replace(/'/g, "''");

  await pool.request().batch(`
    IF DATABASE_PRINCIPAL_ID(N'${escapedQuotedPrincipalName}') IS NULL
      CREATE USER [${escapedPrincipalName}] FROM EXTERNAL PROVIDER;

    IF IS_ROLEMEMBER('db_datareader', '${escapedQuotedPrincipalName}') = 0
      ALTER ROLE db_datareader ADD MEMBER [${escapedPrincipalName}];

    IF IS_ROLEMEMBER('db_datawriter', '${escapedQuotedPrincipalName}') = 0
      ALTER ROLE db_datawriter ADD MEMBER [${escapedPrincipalName}];
  `);
}

async function main() {
  await pool.connect();
  await applyInitialMigrationIfNeeded();
  await seedDatabase();
  await ensureDatabaseUser();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.close();
  });