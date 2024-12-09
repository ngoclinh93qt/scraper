import { ArrayNotEmpty, IsArray, IsString, IsUrl } from "class-validator";

export class CreateUrlDto {
  @IsArray({ message: 'urls must be an array' })
  @ArrayNotEmpty()
  @IsUrl({}, { each: true, message: 'Url is not valid.' })
  urls: string[];
}
