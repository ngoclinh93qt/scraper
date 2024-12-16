import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UsePipes, ValidationPipe, UseInterceptors, UploadedFile, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path'
import * as fs from 'fs/promises';

@Controller('urls')
export class UrlController {
  constructor(private readonly urlService: UrlService) { }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  scrapeUrls(@Body() createUrlDto: CreateUrlDto) {
    return this.urlService.scrapeUrls(createUrlDto);
  }

  @Post('dynamic')
  @UseInterceptors(

    // TODO: we can uploads the files to a CDN (s3, google storage...)
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(csv)$/)) {
          return cb(new BadRequestException('Only .csv files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB max file size
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log("aaaaa", file)
    try {
      const result = await this.urlService.processCsv(file.path);
      await fs.unlink(file.path);
      return { message: 'Scraped successfully', result };
    } catch (error) {
      console.error('Error scrape urls:', error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
