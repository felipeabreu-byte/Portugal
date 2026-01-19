-- CreateEnum
CREATE TYPE "UserProfile" AS ENUM ('TOURIST', 'RESIDENT');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "city" TEXT,
ADD COLUMN     "profile" "UserProfile" DEFAULT 'TOURIST',
ADD COLUMN     "travel_date" TIMESTAMP(3);
