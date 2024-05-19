import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsGateway } from './conversations.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Conversation,
  ConversationSchema,
} from 'src/core/schema/conversation.schema';
import { Message, MessageSchema } from 'src/core/schema/message.schema';
import { ConversationsController } from './conversations.controller';
import {
  Participant,
  ParticipantSchema,
} from 'src/core/schema/participant.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
      { name: Message.name, schema: MessageSchema },
      { name: Participant.name, schema: ParticipantSchema },
    ]),
  ],
  providers: [ConversationsGateway, ConversationsService],
  controllers: [ConversationsController],
})
export class ConversationsModule {}
