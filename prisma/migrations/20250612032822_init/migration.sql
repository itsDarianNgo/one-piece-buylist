-- CreateEnum
CREATE TYPE "Status" AS ENUM ('AWAITING_ARRIVAL', 'ARRIVED', 'VERIFIED', 'PAID', 'PROBLEM');

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sellerName" TEXT NOT NULL,
    "sellerEmail" TEXT NOT NULL,
    "estimatedQuantity" INTEGER NOT NULL,
    "actualQuantity" INTEGER,
    "status" "Status" NOT NULL DEFAULT 'AWAITING_ARRIVAL',
    "quotedPrice" DOUBLE PRECISION NOT NULL,
    "finalPrice" DOUBLE PRECISION,
    "paymentMethod" TEXT,
    "transactionId" TEXT,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);
