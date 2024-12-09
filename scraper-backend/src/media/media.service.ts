
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) { }

  async getMedia(page: number, limit: number, type?: string, search?: string) {
    const skip = (page - 1) * limit;

    let whereClause: any = {};

    if (type) {
      whereClause.type = type;
    }

    if (search) {
      whereClause.link = { contains: search };
    }

    const media = await this.prisma.scrapedData.findMany({
      where: whereClause,
      skip: skip,
      take: limit,
    });

    const totalCount = await this.prisma.scrapedData.count({
      where: whereClause,
    });

    return { media, totalCount };
  }
}
