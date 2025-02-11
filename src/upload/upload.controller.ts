import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('file', 10))
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    const imgUrls: string[] = [];

    await Promise.all(
      files.map(async (file: Express.Multer.File) => {
        const fileUrl = await this.uploadService.uploadImage(file); // 업로드 후 URL 반환
        imgUrls.push(fileUrl);
      }),
    );

    return {
      statusCode: 201,
      message: '이미지 등록 성공',
      data: imgUrls, // 이미지 URL들을 반환
    };
  }
}
