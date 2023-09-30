-- CreateEnum
CREATE TYPE "AudioStatus" AS ENUM ('pending', 'processing', 'success', 'failed');

-- CreateTable
CREATE TABLE "audios" (
    "id" TEXT NOT NULL,
    "status" "AudioStatus" NOT NULL DEFAULT 'pending',
    "name" TEXT,
    "original_name" TEXT NOT NULL,
    "transcription" TEXT,
    "srt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "audios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompt_templates" (
    "id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "title" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "prompt_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "audios_name_key" ON "audios"("name");

-- CreateIndex
CREATE UNIQUE INDEX "prompt_templates_title_key" ON "prompt_templates"("title");
