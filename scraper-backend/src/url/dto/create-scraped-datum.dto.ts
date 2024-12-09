import { IsString, IsArray, ArrayNotEmpty, IsInt } from 'class-validator';
export class CreateScrapedDatumDto {
  @IsInt()
  scraperId: number;

  @IsString()
  url: string;

  @IsArray()
  @ArrayNotEmpty()
  images: string[];

  @IsArray()
  @ArrayNotEmpty()
  videos: string[];
}
