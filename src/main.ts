import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: 'http://localhost:3000', // Chỉ cho phép origin của React (http://localhost:3000)
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: 'Content-Type,Authorization',
    },
  });

  // Set up Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Tantandihoc')
    .setDescription('List Api')
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('Users')
    .addTag('Posts')
    .addTag('Tags')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Serve static assets (if applicable)
  app.useStaticAssets(join(__dirname, '../../uploads'));

  await app.listen(8080);
}

bootstrap();
