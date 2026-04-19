-- CreateTable
CREATE TABLE "SharedRequest" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "SharedRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SharedRequest_token_key" ON "SharedRequest"("token");

-- AddForeignKey
ALTER TABLE "SharedRequest" ADD CONSTRAINT "SharedRequest_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;
