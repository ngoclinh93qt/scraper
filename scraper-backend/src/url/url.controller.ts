import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';

@Controller('urls')
export class UrlController {
  constructor(private readonly urlService: UrlService) { }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  create(@Body() createUrlDto: CreateUrlDto) {
    return this.urlService.scrapeUrls(createUrlDto);
  }

}
