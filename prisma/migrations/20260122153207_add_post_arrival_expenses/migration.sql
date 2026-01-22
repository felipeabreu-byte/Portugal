-- CreateTable
CREATE TABLE "post_arrival_expenses" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount_eur" DECIMAL(65,30) NOT NULL,
    "start_month" INTEGER NOT NULL DEFAULT 1,
    "duration_months" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_arrival_expenses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "post_arrival_expenses" ADD CONSTRAINT "post_arrival_expenses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
