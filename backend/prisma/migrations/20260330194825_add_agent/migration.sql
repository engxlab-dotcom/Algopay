-- CreateEnum
CREATE TYPE "AgentStatus" AS ENUM ('active', 'limit_reached', 'suspended');

-- CreateTable
CREATE TABLE "agents" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "poolId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "algoAddress" TEXT NOT NULL,
    "dailyLimitCents" INTEGER NOT NULL,
    "dailySpentCents" INTEGER NOT NULL DEFAULT 0,
    "vendorWhitelistHash" TEXT NOT NULL,
    "status" "AgentStatus" NOT NULL DEFAULT 'active',
    "lastResetAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "algoTxnId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "agents_algoAddress_key" ON "agents"("algoAddress");

-- AddForeignKey
ALTER TABLE "agents" ADD CONSTRAINT "agents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agents" ADD CONSTRAINT "agents_poolId_fkey" FOREIGN KEY ("poolId") REFERENCES "gas_pools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
