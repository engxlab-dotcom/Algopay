-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'processing', 'settled', 'failed');

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "poolId" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "amountUsdCents" INTEGER NOT NULL,
    "amountUsdc" TEXT,
    "algoTxnId" TEXT,
    "blockRound" INTEGER,
    "confirmedAt" TIMESTAMP(3),
    "gasSponsored" BOOLEAN NOT NULL DEFAULT true,
    "gasFeeAlgo" TEXT,
    "noahReference" TEXT,
    "network" "Network" NOT NULL DEFAULT 'testnet',
    "timeline" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_invoiceId_key" ON "payments"("invoiceId");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_poolId_fkey" FOREIGN KEY ("poolId") REFERENCES "gas_pools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
