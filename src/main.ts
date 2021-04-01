import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'dotenv';
import { join } from 'path';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  config();
  app.enableCors();
  app.useStaticAssets(join(__dirname, '..', 'public'));
  const documentBuilder = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Instagram')
    .setDescription(
      `To get image url concat ${
        process.env.HOST_URL || 'host url'
      } and {fileName}`,
    )
    .setVersion('1.0')
    .build();
  const doc = SwaggerModule.createDocument(app, documentBuilder);
  SwaggerModule.setup('api', app, doc);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
