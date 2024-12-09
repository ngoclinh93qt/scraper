/*
  Warnings:

  - A unique constraint covering the columns `[urlId,link]` on the table `ScrapedData` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `ScrapedData_urlId_link_key` ON `ScrapedData`(`urlId`, `link`);
