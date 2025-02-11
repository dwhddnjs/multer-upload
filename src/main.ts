import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*', // 모든 도메인에서 접근 가능
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // 허용할 HTTP 메소드
    allowedHeaders: 'Content-Type, Accept', // 허용할 헤더
    credentials: true, // 자격 증명 허용 (쿠키 등)
  });

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
