import { IsOptional, IsString } from "class-validator"

export class CreateEntrypointDto {
  @IsString()
  @IsOptional()
  description: string

  @IsString()
  secret: string

  @IsString()
  slug: string

  @IsString()
  publication_id: string
}
