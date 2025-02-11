import { Module } from '@nestjs/common';

import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule], // ConfigService가 제공되는 모듈을 임포트
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
