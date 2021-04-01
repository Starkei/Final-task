import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'dotenv';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  config();
  app.enableCors();
  const documentBuilder = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Instagram')
    .setDescription('final task')
    .setVersion('1.0')
    .build();
  const doc = SwaggerModule.createDocument(app, documentBuilder);
  SwaggerModule.setup('api', app, doc);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
