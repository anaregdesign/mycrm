BEGIN TRY

BEGIN TRAN;

-- CreateSchema
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = N'dbo') EXEC sp_executesql N'CREATE SCHEMA [dbo];';

-- CreateTable
CREATE TABLE [dbo].[Account] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [channel] NVARCHAR(1000) NOT NULL,
    [region] NVARCHAR(1000) NOT NULL,
    [segment] NVARCHAR(1000) NOT NULL,
    [health] NVARCHAR(1000) NOT NULL,
    [annualRevenue] DECIMAL(18,2) NOT NULL,
    [summary] NVARCHAR(1000) NOT NULL,
    [nextAction] NVARCHAR(1000) NOT NULL,
    [lastContactAt] DATETIME2 NOT NULL,
    [currentProductNames] NVARCHAR(1000) NOT NULL,
    [whitespaceProductNames] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Account_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Account_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[AccountSite] (
    [id] NVARCHAR(1000) NOT NULL,
    [accountId] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [prefecture] NVARCHAR(1000) NOT NULL,
    [format] NVARCHAR(1000) NOT NULL,
    [monthlyVolume] INT NOT NULL,
    [installedSkus] INT NOT NULL,
    CONSTRAINT [AccountSite_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Contact] (
    [id] NVARCHAR(1000) NOT NULL,
    [accountId] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [role] NVARCHAR(1000) NOT NULL,
    [department] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000),
    [phone] NVARCHAR(1000),
    [influence] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Contact_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Product] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [category] NVARCHAR(1000) NOT NULL,
    [temperatureZone] NVARCHAR(1000) NOT NULL,
    [shelfLifeDays] INT NOT NULL,
    [packSize] NVARCHAR(1000) NOT NULL,
    [marginBand] NVARCHAR(1000) NOT NULL,
    [targetChannels] NVARCHAR(1000) NOT NULL,
    [basePrice] DECIMAL(18,2) NOT NULL,
    CONSTRAINT [Product_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Opportunity] (
    [id] NVARCHAR(1000) NOT NULL,
    [accountId] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [stage] NVARCHAR(1000) NOT NULL,
    [probability] INT NOT NULL,
    [expectedMonthlyRevenue] DECIMAL(18,2) NOT NULL,
    [targetCloseMonth] NVARCHAR(1000) NOT NULL,
    [owner] NVARCHAR(1000) NOT NULL,
    [blockers] NVARCHAR(1000) NOT NULL,
    [nextStep] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Opportunity_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[OpportunityProduct] (
    [opportunityId] NVARCHAR(1000) NOT NULL,
    [productId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [OpportunityProduct_pkey] PRIMARY KEY CLUSTERED ([opportunityId],[productId])
);

-- CreateTable
CREATE TABLE [dbo].[Activity] (
    [id] NVARCHAR(1000) NOT NULL,
    [accountId] NVARCHAR(1000) NOT NULL,
    [type] NVARCHAR(1000) NOT NULL,
    [subject] NVARCHAR(1000) NOT NULL,
    [scheduledFor] DATETIME2 NOT NULL,
    [owner] NVARCHAR(1000) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL,
    [notes] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Activity_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[SalesCondition] (
    [id] NVARCHAR(1000) NOT NULL,
    [accountId] NVARCHAR(1000) NOT NULL,
    [paymentTerms] NVARCHAR(1000) NOT NULL,
    [rebateRate] DECIMAL(5,2) NOT NULL,
    [leadTimeDays] INT NOT NULL,
    [minimumOrderValue] DECIMAL(18,2) NOT NULL,
    [logisticsMode] NVARCHAR(1000) NOT NULL,
    [promotionBudgetRatio] DECIMAL(5,2) NOT NULL,
    CONSTRAINT [SalesCondition_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [SalesCondition_accountId_key] UNIQUE NONCLUSTERED ([accountId])
);

-- AddForeignKey
ALTER TABLE [dbo].[AccountSite] ADD CONSTRAINT [AccountSite_accountId_fkey] FOREIGN KEY ([accountId]) REFERENCES [dbo].[Account]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Contact] ADD CONSTRAINT [Contact_accountId_fkey] FOREIGN KEY ([accountId]) REFERENCES [dbo].[Account]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Opportunity] ADD CONSTRAINT [Opportunity_accountId_fkey] FOREIGN KEY ([accountId]) REFERENCES [dbo].[Account]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[OpportunityProduct] ADD CONSTRAINT [OpportunityProduct_opportunityId_fkey] FOREIGN KEY ([opportunityId]) REFERENCES [dbo].[Opportunity]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[OpportunityProduct] ADD CONSTRAINT [OpportunityProduct_productId_fkey] FOREIGN KEY ([productId]) REFERENCES [dbo].[Product]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Activity] ADD CONSTRAINT [Activity_accountId_fkey] FOREIGN KEY ([accountId]) REFERENCES [dbo].[Account]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[SalesCondition] ADD CONSTRAINT [SalesCondition_accountId_fkey] FOREIGN KEY ([accountId]) REFERENCES [dbo].[Account]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

