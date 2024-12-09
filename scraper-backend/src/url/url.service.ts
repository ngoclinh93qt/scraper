


import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { chromium } from 'playwright'
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUrlDto } from './dto/create-url.dto';

@Injectable()
export class UrlService {
  constructor(private readonly prisma: PrismaService) { }

  async scrapeUrls(data: CreateUrlDto) {
    for (const address of data.urls) {
      try {

        // const browser = await chromium.launch();
        // const page = await browser.newPage();
        // await page.goto(address)
        //
        // const images = await page.evaluate(() =>
        //   Array.from(document.querySelectorAll('img')).map((img) => (img as HTMLImageElement).src));
        //
        // const videos = await page.evaluate(() =>
        //   Array.from(document.querySelectorAll('video source')).map((video) => (video as HTMLSourceElement).src));
        //
        const response = await fetch(address);
        const html = await response.text();
        const $ = cheerio.load(html);

        const images = $('img').map((_, el) => $(el).attr('src')).get();
        const videos = $('video source').map((_, el) => $(el).attr('src')).get();
        // const video = $('video').map((_, el) => $(el).attr('class')).get();

        console.log(videos, images)



        const urlRecord = await this.prisma.uRL.upsert({
          where: { address },
          update: { status: 'completed' },
          create: { address, status: 'completed' },
        });

        await this.prisma.scrapedData.createMany({
          data: [
            ...images.map(link => ({ type: 'image', link, urlId: urlRecord.id })),
            ...videos.map(link => ({ type: 'video', link, urlId: urlRecord.id })),
          ],
          skipDuplicates: true,
        });
      } catch (error) {
        console.error(`Failed to scrape ${address}:`, error);

        await this.prisma.uRL.upsert({
          where: { address },
          update: { status: 'failed' },
          create: { address, status: 'failed' },
        });
        throw error;
      }
    }
  }
  async getScrapedData(page: number, pageSize: number) {
    return this.prisma.uRL.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }
}

