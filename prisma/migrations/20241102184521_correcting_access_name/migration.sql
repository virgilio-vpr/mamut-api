/*
  Warnings:

  - You are about to drop the column `acess_last` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "acess_last",
ADD COLUMN     "access_last" TIMESTAMP(3);
