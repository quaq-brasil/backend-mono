import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { FileEntity } from "@prisma/client"
import { S3FileUploadService } from "./s3-upload.service"

@Controller("/api/v1/fileUpload")
export class S3FileUploadController {
  constructor(private fileUploadService: S3FileUploadService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor("file", {
      fileFilter: (req, file, cb) => {
        const allowedMimes = [
          "application/pdf",
          "image/jpeg",
          "image/png",
          "image/svg+xml",
        ]

        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true)
        } else {
          cb(new BadRequestException("Invalid file type."), false)
        }
      },
    })
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File
  ): Promise<FileEntity> {
    const uploadedFile = await this.fileUploadService.uploadFile(
      file.buffer,
      file.originalname,
      file.mimetype
    )
    return uploadedFile
  }
}
