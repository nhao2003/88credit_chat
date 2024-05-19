import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvConstants } from './common/constants/env/env.constants';
import { ConversationsModule } from './app/conversations/conversations.module';
import { MessagesModule } from './app/messages/messages.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { AccessTokenJwtGuard } from './core/guards';
import { AccessTokenStrategy } from './core/strategies';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>(EnvConstants.mongoUri),
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
    {
      provide: 'APP_GUARD',
      useClass: AccessTokenJwtGuard,
    },
  ],
})
export class AppModule {}
