import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';

@Injectable()
export class UploadService {
  private readonly s3Client: S3Client;
  private readonly bucketName = 'upload-bucket-multer';
  private readonly region = 'us-east-1'; // AWS region 설정

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.get<string>(
          'AWS_ACCESS_KEY_ID',
        ) as string,
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ) as string,
      },
    });
  }

  async uploadImage(file: Express.Multer.File) {
    const key = `${Date.now() + file.originalname}`;

    // 파일 확장자에 따라 Content-Type 설정
    const fileExtension = path.extname(file.originalname).toLowerCase();
    let contentType = 'application/octet-stream'; // 기본 MIME 타입

    if (fileExtension === '.png') {
      contentType = 'image/png';
    } else if (fileExtension === '.jpg' || fileExtension === '.jpeg') {
      contentType = 'image/jpeg';
    }

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: contentType, // Content-Type 설정
      ACL: 'public-read', // 퍼블릭 읽기 권한 설정
    });

    try {
      // S3에 파일 업로드
      await this.s3Client.send(command);

      // 파일 URL 생성
      const fileUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
      return fileUrl; // URL을 반환
    } catch (err) {
      throw new Error(`Failed to upload image: ${err.message}`);
    }
  }
}
