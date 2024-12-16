


import { BadRequestException, Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { executablePath, launch } from 'puppeteer'
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUrlDto } from './dto/create-url.dto';
import * as csvParser from 'fast-csv';
import { Media } from 'src/media/entities/media.entity';
import * as fs from 'fs';

@Injectable()
export class UrlService {
  private batchSize = 5;
  private urlRegex = /^((https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(\/[^\s]*)?$/;



  constructor(private readonly prisma: PrismaService) { }

  async scrapeUrls(data: CreateUrlDto) {
    for (const address of data.urls) {
      try {

        const response = await fetch(address);
        const html = await response.text();
        const cheer = cheerio.load(html);

        const images = cheer('img').map((_, el) => cheer(el).attr('src')).get();
        const videos = cheer('video source').map((_, el) => cheer(el).attr('src')).get();

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

  async processCsv(file: string): Promise<any> {
    const urls: string[] = [];
    let processedCount = 0;

    const scrapeMedia = async (url: string): Promise<Media[]> => {
      const browser = await launch({
        executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();


      try {

        const urlRecord = await this.prisma.uRL.upsert({
          where: { address: url },
          update: { status: 'completed' },
          create: { address: url, status: 'completed' },
        });

        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

        const images = await page.$$eval('img', (imgs) => imgs.map((img) => img.src));
        const videos = await page.$$eval('video', (vids) => vids.map((video) => video.src));

        const imagesData: Media[] = []
        const videosData: Media[] = []

        images.forEach(image => {
          imagesData.push({
            type: 'image',
            link: image,
            urlId: urlRecord.id
          })
        })

        videos.forEach(video => {
          videosData.push({
            type: 'video',
            link: video,
            urlId: urlRecord.id
          })
        })

        await browser.close();

        return [...imagesData, ...videosData];
      } catch (error) {
        console.error(`Failed to scrape ${url}:`, error.message);
        await browser.close();

        await this.prisma.uRL.upsert({
          where: { address: url },
          update: { status: 'error' },
          create: { address: url, status: 'error' },

        });
        return []
      }
    };

    const scrapeAndSaveBatch = async (batch: string[]) => {
      const mediaData = [];

      for (const url of batch) {
        console.log(`processing ${url}`)
        const medias = await scrapeMedia(url);
        medias.forEach((media) => {
          mediaData.push(media)
        })
      }

      await this.prisma.scrapedData.createMany({
        data: [
          ...mediaData
        ],
        skipDuplicates: true,
      });

      processedCount += batch.length;
    };

    return new Promise((resolve, reject) => {
      const fileStream = fs.createReadStream(file);
      const parser = csvParser.parseStream(fileStream, { headers: true });

      parser
        .on('data', async (row) => {
          parser.pause();

          if (!row.url) {
            reject(new BadRequestException('CSV missing "url" column'));
          }

          if (!this.urlRegex.test(row.url)) {
            reject(new BadRequestException(`url ${row.url} invalid`))
          }

          urls.push(row.url);

          if (urls.length >= this.batchSize) {
            await scrapeAndSaveBatch(urls.splice(0, this.batchSize));
          }

          parser.resume();
        })
        .on('error', (error) => reject(error))
        .on('end', async () => {
          if (urls.length > 0) {
            await scrapeAndSaveBatch(urls);
          }

          resolve({ message: 'File processed and URLs scraped successfully', processedCount });
        });
    });
  }
}

