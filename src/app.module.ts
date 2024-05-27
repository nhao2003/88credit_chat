import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvConstants } from './common/constants/env/env.constants';
import { ConversationsModule } from './app/conversations/conversations.module';
import { MessagesModule } from './app/messages/messages.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { AccessTokenJwtGuard, WsGuard } from './core/guards';
import { AccessTokenStrategy, WsJwtStrategy } from './core/strategies';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { LoggerMiddleware } from './core/middlewares/logger.middleware';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>(EnvConstants.mongoUri),
        dbName: '88credit_chat',
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>(
          EnvConstants.accessTokenSecret,
        ),
      }),
      inject: [ConfigService],
    }),
    ConversationsModule,
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AccessTokenStrategy,
    WsJwtStrategy,
    {
      provide: APP_GUARD,
      useClass: AccessTokenJwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: WsGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); // Apply to all routes
  }
}
