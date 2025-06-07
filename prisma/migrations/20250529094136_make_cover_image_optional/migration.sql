-- AlterTable
ALTER TABLE "books" ALTER COLUMN "coverImage" DROP NOT NULL;

-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "updatedAt" DROP DEFAULT;
