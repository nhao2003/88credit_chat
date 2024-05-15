import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConversationsService } from './app/conversations/conversations.service';
import { ConversationsController } from './app/conversations/conversations.controller';
import { ConversationsModule } from './app/conversations/conversations.module';
import { MessagesModule } from './app/messages/messages.module';

@Module({
  imports: [ConversationsModule, MessagesModule],
  controllers: [AppController, ConversationsController],
  providers: [AppService, ConversationsService],
})
export class AppModule {}
