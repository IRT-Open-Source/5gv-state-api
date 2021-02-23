import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'body-parser';
import { Logger } from '@nestjs/common';

const PORT = 3000;
const logger = new Logger('main.js');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '50mb' }));
  app.enableCors();
  await app.listen(PORT);
  logger.log(`Listening @ :${PORT}`);
}
bootstrap();
