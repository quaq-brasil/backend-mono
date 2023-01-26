import { IsString } from 'class-validator';

export class CreatePublicationRequest {
  @IsString()
  title: string;

  blocks: any[];

  @IsString()
  template_id: string;

  @IsString()
  page_id: string;
}
