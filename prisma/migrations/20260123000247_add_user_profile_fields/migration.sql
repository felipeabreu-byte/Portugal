-- AlterTable
ALTER TABLE "users" ADD COLUMN     "age" INTEGER,
ADD COLUMN     "phone" TEXT;

-- CreateTable
CREATE TABLE "post_arrival_incomes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount_eur" DECIMAL(65,30) NOT NULL,
    "start_month" INTEGER NOT NULL DEFAULT 1,
    "duration_months" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_arrival_incomes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "post_arrival_incomes" ADD CONSTRAINT "post_arrival_incomes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
