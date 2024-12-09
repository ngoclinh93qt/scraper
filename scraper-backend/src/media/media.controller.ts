import { Controller, Get, Query } from '@nestjs/common';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) { }

  @Get('paginated')
  async getPaginatedMedia(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('type') type?: string,
    @Query('search') search?: string,
  ) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const result = await this.mediaService.getMedia(
      pageNumber,
      limitNumber,
      type,
      search,
    );

    return result;
  }
}
