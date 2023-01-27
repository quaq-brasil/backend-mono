import { CreateFileDto } from './create-file.dto';
declare const UpdateFileDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateFileDto>>;
export declare class UpdateFileDto extends UpdateFileDto_base {
    name: string;
    url: string;
    type: string;
    size: number;
    mime_type: string;
    metadata: any;
}
export {};
