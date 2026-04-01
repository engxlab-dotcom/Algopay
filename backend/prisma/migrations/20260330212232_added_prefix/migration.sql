/*
  Warnings:

  - Added the required column `keyPrefix` to the `api_keys` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "api_keys" ADD COLUMN     "keyPrefix" TEXT NOT NULL;
