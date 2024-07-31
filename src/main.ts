import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './infrastructure/modules/app.modules';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const NODE_PORT = configService.get('NODE_PORT');
  const CORS_ORIGINS = configService.get('CORS_ORIGINS');

  app.enableCors({ origin: CORS_ORIGINS, credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.use(cookieParser());
  await app.listen(NODE_PORT);
}

bootstrap();
