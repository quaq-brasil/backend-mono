import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { S3FileUploadController } from './s3-upload.controller';
import { S3FileUploadService } from './s3-upload.service';

@Module({
	controllers: [S3FileUploadController],
	providers: [S3FileUploadService, PrismaService, ConfigService],
})
export class S3FileUploadModule {}
