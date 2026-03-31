/*
  Warnings:

  - Made the column `userId` on table `api_keys` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "PoolStatus" AS ENUM ('healthy', 'low', 'critical', 'empty');

-- DropForeignKey
ALTER TABLE "api_keys" DROP CONSTRAINT "api_keys_userId_fkey";

-- AlterTable
ALTER TABLE "api_keys" ALTER COLUMN "userId" SET NOT NULL;

-- CreateTable
CREATE TABLE "gas_pools" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "apiKeyId" TEXT NOT NULL,
    "balanceUsdc" BIGINT NOT NULL DEFAULT 0,
    "dailyCapCents" INTEGER NOT NULL DEFAULT 0,
    "alertThresholdUsdc" BIGINT NOT NULL DEFAULT 0,
    "status" "PoolStatus" NOT NULL DEFAULT 'empty',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gas_pools_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "gas_pools_apiKeyId_key" ON "gas_pools"("apiKeyId");

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gas_pools" ADD CONSTRAINT "gas_pools_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gas_pools" ADD CONSTRAINT "gas_pools_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "api_keys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
