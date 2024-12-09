-- CreateTable
CREATE TABLE `URL` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `errorMessage` VARCHAR(191) NULL,

    UNIQUE INDEX `URL_url_key`(`url`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ScrapedData` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contentUrl` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `width` INTEGER NULL,
    `height` INTEGER NULL,
    `contentSize` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `URLScrapedData` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `urlId` INTEGER NOT NULL,
    `scrapedDataId` INTEGER NOT NULL,

    UNIQUE INDEX `URLScrapedData_urlId_scrapedDataId_key`(`urlId`, `scrapedDataId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `URLScrapedData` ADD CONSTRAINT `URLScrapedData_urlId_fkey` FOREIGN KEY (`urlId`) REFERENCES `URL`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `URLScrapedData` ADD CONSTRAINT `URLScrapedData_scrapedDataId_fkey` FOREIGN KEY (`scrapedDataId`) REFERENCES `ScrapedData`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
