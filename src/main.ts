import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerConfig } from './configs/docs/swagger.config';
import { EnvConstants } from './common/constants/env/env.constants';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  SwaggerConfig.config(app);
  const configService = app.get(ConfigService);
  const rabbitMQHost =
    configService.get(EnvConstants.RABBITMQ_HOST) ?? 'localhost';
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      url: 'amqp://guest:guest@' + rabbitMQHost + ':5672',
      queue: 'chat_queue',
    },
  });
  const port = configService.get<number>(EnvConstants.port);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
}
bootstrap();
