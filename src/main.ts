import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const port = AppModule.port;
  await app.listen(port, () => {
    console.log(`Corriendo en el Perto ${port}`);
  });
}
bootstrap();
