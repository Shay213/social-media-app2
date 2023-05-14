/*
  Warnings:

  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `viewed_profile` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "friends" ALTER COLUMN "occupation" SET DEFAULT '',
ALTER COLUMN "location" SET DEFAULT '';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "createdAt",
DROP COLUMN "viewed_profile",
ADD COLUMN     "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "viewedProfile" INTEGER DEFAULT 0,
ALTER COLUMN "location" SET DEFAULT '',
ALTER COLUMN "occupation" SET DEFAULT '',
ALTER COLUMN "impressions" SET DEFAULT 0,
ALTER COLUMN "updatedAt" DROP DEFAULT;
