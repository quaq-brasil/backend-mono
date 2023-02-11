import {
	Controller,
	Post,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3FileUploadService } from './s3-upload.service';

@Controller('/ap1/v1/fileUpload')
export class S3FileUploadController {
	constructor(private fileUploadService: S3FileUploadService) {}

	@Post()
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<void> {
		const uploadedFile = await this.fileUploadService.uploadFile(
			file.buffer,
			file.originalname,
		);
		console.log('File has been uploaded,', uploadedFile.fileName);
	}
}
