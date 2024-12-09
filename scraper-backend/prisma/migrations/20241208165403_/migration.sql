/*
  Warnings:

  - You are about to drop the column `contentSize` on the `ScrapedData` table. All the data in the column will be lost.
  - You are about to drop the column `contentUrl` on the `ScrapedData` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `ScrapedData` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `ScrapedData` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `ScrapedData` table. All the data in the column will be lost.
  - You are about to drop the column `errorMessage` on the `URL` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `URL` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `URL` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `URL` table. All the data in the column will be lost.
  - You are about to drop the `URLScrapedData` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[address]` on the table `URL` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `link` to the `ScrapedData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `urlId` to the `ScrapedData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `URL` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `URLScrapedData` DROP FOREIGN KEY `URLScrapedData_scrapedDataId_fkey`;

-- DropForeignKey
ALTER TABLE `URLScrapedData` DROP FOREIGN KEY `URLScrapedData_urlId_fkey`;

-- DropIndex
DROP INDEX `URL_url_key` ON `URL`;

-- AlterTable
ALTER TABLE `ScrapedData` DROP COLUMN `contentSize`,
    DROP COLUMN `contentUrl`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `height`,
    DROP COLUMN `width`,
    ADD COLUMN `link` VARCHAR(191) NOT NULL,
    ADD COLUMN `urlId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `URL` DROP COLUMN `errorMessage`,
    DROP COLUMN `status`,
    DROP COLUMN `updatedAt`,
    DROP COLUMN `url`,
    ADD COLUMN `address` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `URLScrapedData`;

-- CreateIndex
CREATE UNIQUE INDEX `URL_address_key` ON `URL`(`address`);

-- AddForeignKey
ALTER TABLE `ScrapedData` ADD CONSTRAINT `ScrapedData_urlId_fkey` FOREIGN KEY (`urlId`) REFERENCES `URL`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
