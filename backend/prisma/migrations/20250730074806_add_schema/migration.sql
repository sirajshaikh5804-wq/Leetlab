/*
  Warnings:

  - You are about to drop the column `codeSnipptes` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `referenceSolutions` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `testcases` on the `Problem` table. All the data in the column will be lost.
  - Added the required column `codeSnippets` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referenceSolutions` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `testCases` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "codeSnipptes",
DROP COLUMN "referenceSolutions",
DROP COLUMN "testcases",
ADD COLUMN     "codeSnippets" JSONB NOT NULL,
ADD COLUMN     "referenceSolutions" JSONB NOT NULL,
ADD COLUMN     "testCases" JSONB NOT NULL;
