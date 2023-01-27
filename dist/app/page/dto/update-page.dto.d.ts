import { CreatePageDto } from './create-page.dto';
declare const UpdatePageDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreatePageDto>>;
export declare class UpdatePageDto extends UpdatePageDto_base {
    is_stripe_active: boolean;
    facebook_pixel_id: string;
    google_analytics_id: string;
}
export {};
