import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [process.env.CORS_ORIGIN, 'https://studio.apollographql.com'],
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(4000);
}
bootstrap();
