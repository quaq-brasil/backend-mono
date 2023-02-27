import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { FileEntity } from '@prisma/client'
import { S3 } from 'aws-sdk'
import { randomUUID } from 'crypto'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class S3FileUploadService {
	constructor(
		private prismaService: PrismaService,
		private readonly configService: ConfigService,
	) {}

	async uploadFile(
		dataBuffer: Buffer,
		fileName: string,
		contentType: string,
	): Promise<FileEntity> {
		const s3 = new S3()
		const uploadResult = await s3
			.upload({
				Bucket: this.configService.get('AWS_BUCKET_NAME'),
				Body: dataBuffer,
				Key: `${randomUUID()}-${fileName}`,
				ACL: 'public-read',
				ContentType: contentType,
			})
			.promise()

		const fileStorageInDB = {
			fileName: fileName,
			fileUrl: uploadResult.Location,
			key: uploadResult.Key,
		}

		const filestored = await this.prismaService.fileEntity.create({
			data: fileStorageInDB,
		})

		return filestored
	}
}
