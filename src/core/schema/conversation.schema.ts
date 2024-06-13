import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Message } from './message.schema';
import { Types } from 'mongoose';

@Schema({
  id: true,
  timestamps: true,
  versionKey: false,
})
export class Conversation {
  _id: Types.ObjectId;

  @Prop({
    type: Message,
    default: null,
  })
  lastMessage?: Message;

  @Prop({
    type: [Types.UUID],
    required: true,
  })
  participants: Types.UUID[];
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
