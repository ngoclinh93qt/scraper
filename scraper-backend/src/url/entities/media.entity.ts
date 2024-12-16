import { IsInt, IsString, IsUrl } from "class-validator"

export class media {
  @IsString()
  type: string

  @IsString()
  link: string

  @IsInt()
  urlId: number
}
