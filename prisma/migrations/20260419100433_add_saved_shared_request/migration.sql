-- CreateTable
CREATE TABLE "saved_shared_request" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "requestSnapshot" JSONB NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_shared_request_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "saved_shared_request_userId_token_key" ON "saved_shared_request"("userId", "token");

-- AddForeignKey
ALTER TABLE "saved_shared_request" ADD CONSTRAINT "saved_shared_request_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
